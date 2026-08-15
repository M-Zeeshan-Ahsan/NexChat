import { ObjectId } from "mongodb";
import { connection } from "../config/dbconfig.js";
import ApiError from "../middleware/apiError.js";
import { success } from "zod";

const conversationCollection = "conversations";
const userCollection = "users";
const messagesCollection = "messages";

export const createConversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    const db = await connection();
    const collection = await db.collection(conversationCollection);
    const userCol = await db.collection(userCollection);
    const receiverUser = await userCol.findOne({
      _id: new ObjectId(receiverId),
    });

    if (!receiverUser) {
      throw new ApiError(404, "User not found");
    }
    // Check if conversation already exists
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

    // Create new conversation
    const result = await collection.insertOne({
      participants: [new ObjectId(senderId), new ObjectId(receiverId)],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get newly created conversation
    const newConversation = await collection.findOne({
      _id: result.insertedId,
    });

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

    const db = await connection();
    const collection = db.collection(conversationCollection);

    const conversations = await collection
      .aggregate([
        // Sirf current user ki conversations
        {
          $match: {
            participants: userId,
          },
        },

        // Current user ko participants se remove karo
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

        // Array se single ObjectId nikalo
        {
          $unwind: "$otherUser",
        },

        // users collection join
        {
          $lookup: {
            from: "users",
            localField: "otherUser",
            foreignField: "_id",
            as: "chatuser",
          },
        },

        // user array ko object banao
        {
          $unwind: "$chatuser",
        },

        // Sirf required fields bhejo
        {
          $project: {
            _id: 0,
            id: "$_id",
            participants: 1,
            createdAt: 1,
            updatedAt: 1,
            "chatuser._id": 1,
            "chatuser.name": 1,
            "chatuser.email": 1,
            "chatuser.profileImage": 1,
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
    const senderId = new ObjectId(req.user.id);
    const { conversationId } = req.params;

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
        "You are not allowed to access this conversation",
      );
    }

    // Get all messages
    const messages = await messageCol
      .find({
        conversationId: new ObjectId(conversationId),
      })
      .sort({ createdAt: 1 }) // Oldest → Newest
      .toArray();

    return res.status(200).json({
      success: true,
      total: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};
