import { ObjectId } from "mongodb";
import { connection } from "../config/dbconfig.js";
import ApiError from "../middleware/apiError.js";
import { getIO } from "../sockets/socket.js";

const conversationCollection = "conversations";
const userCollection = "users";
const messagesCollection = "messages";

export const createConversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    // =========================
    // Validate Self Conversation
    // =========================
    if (senderId === receiverId) {
      throw new ApiError(400, "You cannot create a conversation with yourself");
    }

    const db = await connection();

    const collection = db.collection(conversationCollection);

    const userCol = db.collection(userCollection);

    // =========================
    // Check Receiver
    // =========================
    const receiverUser = await userCol.findOne({
      _id: new ObjectId(receiverId),
    });

    if (!receiverUser) {
      throw new ApiError(404, "User not found");
    }

    // =========================
    // Check Sender
    // =========================
    const senderUser = await userCol.findOne({
      _id: new ObjectId(senderId),
    });

    if (!senderUser) {
      throw new ApiError(404, "Sender user not found");
    }

    // =========================
    // Check Existing Conversation
    // =========================
    const conversation = await collection.findOne({
      participants: {
        $all: [new ObjectId(senderId), new ObjectId(receiverId)],
      },
    });

    if (conversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation,
      });
    }

    // =========================
    // Create Conversation
    // =========================
    const newConversationData = {
      participants: [new ObjectId(senderId), new ObjectId(receiverId)],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newConversationData);

    // =========================
    // Get New Conversation
    // =========================
    const newConversation = await collection.findOne({
      _id: result.insertedId,
    });

    console.log("🆕 Conversation Created:", newConversation);

    // =========================
    // Socket IO
    // =========================
    const io = getIO();

    // Conversation object for Receiver
    const receiverConversation = {
      id: newConversation._id.toString(),

      participants: newConversation.participants.map((id) => id.toString()),

      createdAt: newConversation.createdAt,

      updatedAt: newConversation.updatedAt,

      chatuser: {
        id: senderUser._id.toString(),
        name: senderUser.name,
        email: senderUser.email,
        profileImage: senderUser.profileImage || null,
      },

      unreadCount: 0,

      lastMessage: {
        message: "",
        createdAt: null,
      },
    };

    // =========================
    // Send New Conversation
    // to Receiver in Real-Time
    // =========================
    io.to(`user:${receiverId}`).emit("newConversation", receiverConversation);

    console.log(`📢 New conversation sent to user:${receiverId}`);

    // =========================
    // API Response
    // =========================
    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.user.id);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const db = await connection();

    const collection = db.collection(conversationCollection);

    const conversations = await collection
      .aggregate([
        // 1. Current user's conversations
        {
          $match: {
            participants: userId,
          },
        },

        // 2. Find other user
        {
          $project: {
            participants: 1,
            createdAt: 1,
            updatedAt: 1,

            otherUser: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: {
                  $ne: ["$$participant", userId],
                },
              },
            },
          },
        },

        // 3. Array -> ObjectId
        {
          $unwind: "$otherUser",
        },

        // 4. Get other user
        {
          $lookup: {
            from: "users",
            localField: "otherUser",
            foreignField: "_id",
            as: "chatuser",
          },
        },

        // 5. User array -> Object
        {
          $unwind: "$chatuser",
        },

        // 6. Get latest message
        {
          $lookup: {
            from: "messages",

            let: {
              conversationId: "$_id",
            },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$conversationId", "$$conversationId"],
                  },
                },
              },

              {
                $sort: {
                  createdAt: -1,
                },
              },

              {
                $limit: 1,
              },

              {
                $project: {
                  _id: 0,
                  message: 1,
                  createdAt: 1,
                },
              },
            ],

            as: "latestMessage",
          },
        },

        // 7. Get unread messages
        {
          $lookup: {
            from: "messages",

            let: {
              conversationId: "$_id",
            },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$conversationId", "$$conversationId"],
                      },

                      // Sirf doosre user ke messages
                      {
                        $ne: ["$senderId", userId],
                      },

                      // Current user ne read nahi kiya
                      {
                        $not: {
                          $in: [
                            userId,
                            {
                              $ifNull: ["$readBy", []],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            ],

            as: "unreadMessages",
          },
        },

        // 8. Count unread messages
        {
          $addFields: {
            unreadCount: {
              $size: "$unreadMessages",
            },
          },
        },

        // 9. latestMessage array -> object
        {
          $unwind: {
            path: "$latestMessage",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Pagination
        {
          $skip: skip,
        },

        {
          $limit: limit,
        },
        // 10. Final response
        {
          $project: {
            _id: 0,

            id: "$_id",

            participants: 1,

            createdAt: 1,
            updatedAt: 1,

            chatuser: {
              id: "$chatuser._id",
              name: "$chatuser.name",
              email: "$chatuser.email",
              profileImage: "$chatuser.profileImage",
            },

            lastMessage: {
              message: "$latestMessage.message",
              createdAt: "$latestMessage.createdAt",
            },

            unreadCount: 1,
          },
        },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const sendMessages = async (req, res, next) => {
  try {
    const senderId = new ObjectId(req.user.id);
    const { conversationId, message } = req.body;

    const db = await connection();

    const conversationCol = db.collection(conversationCollection);
    const messageCol = db.collection(messagesCollection);

    // Check conversation exists
    const conversation = await conversationCol.findOne({
      _id: new ObjectId(conversationId),
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    // Check logged-in user is participant
    const isParticipant = conversation.participants.some(
      (id) => id.toString() === senderId.toString(),
    );

    if (!isParticipant) {
      throw new ApiError(
        403,
        "You are not allowed to send message in this conversation",
      );
    }

    // Save message
    const result = await messageCol.insertOne({
      conversationId: new ObjectId(conversationId),
      senderId,
      message: message.trim(),
      readBy: [new ObjectId(req.user.id)],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update conversation timestamp
    await conversationCol.updateOne(
      { _id: new ObjectId(conversationId) },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
    );

    const newMessage = await messageCol.findOne({
      _id: result.insertedId,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.user.id);
    const { conversationId } = req.params;

    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    // Validate conversation ID
    if (!ObjectId.isValid(conversationId)) {
      throw new ApiError(400, "Invalid conversation ID");
    }

    const conversationObjectId = new ObjectId(conversationId);

    const db = await connection();

    const conversationCol = db.collection(conversationCollection);
    const messageCol = db.collection(messagesCollection);

    // Check conversation exists
    const conversation = await conversationCol.findOne({
      _id: conversationObjectId,
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    // Check logged-in user is participant
    const isParticipant = conversation.participants.some(
      (id) => id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      throw new ApiError(
        403,
        "You are not allowed to access this conversation",
      );
    }

    // Mark other user's unread messages as read
    await messageCol.updateMany(
      {
        conversationId: conversationObjectId,

        // Don't mark my own messages
        senderId: {
          $ne: userId,
        },

        // Only unread messages
        readBy: {
          $nin: [userId],
        },
      },
      {
        $addToSet: {
          readBy: userId,
        },
      },
    );

    // Total messages
    const total = await messageCol.countDocuments({
      conversationId: conversationObjectId,
    });

    // Get paginated messages
    const messages = await messageCol
      .find({
        conversationId: conversationObjectId,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Reverse so frontend gets oldest → newest
    messages.reverse();

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
