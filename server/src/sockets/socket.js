import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connection } from "../config/dbconfig.js";

const onlineUsers = new Map();

const messagesCollection = "messages";
let ioInstance = null;

export const getIO = () => ioInstance;
export const socketConnection = (io) => {
  ioInstance = io;
  // =========================
  // Socket Authentication
  // =========================
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      socket.userId = decoded.id;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  // =========================
  // Socket Connection
  // =========================
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    console.log("User ID:", socket.userId);

    // Store online user
    onlineUsers.set(socket.userId, socket.id);

    console.log("Online Users:", onlineUsers);
    // Join personal user room
    socket.join(`user:${socket.userId}`);

    console.log(`User joined personal room: user:${socket.userId}`);
    // =========================
    // Join Conversation
    // =========================
    socket.on("joinConversation", async (conversationId) => {
      try {
        if (!ObjectId.isValid(conversationId)) {
          return socket.emit("messageError", {
            message: "Invalid Conversation Id",
          });
        }

        const db = await connection();

        const conversationCollection = db.collection("conversations");

        const conversation = await conversationCollection.findOne({
          _id: new ObjectId(conversationId),
          participants: new ObjectId(socket.userId),
        });

        if (!conversation) {
          return socket.emit("messageError", {
            message: "You are not a participant of this conversation",
          });
        }

        socket.join(conversationId);

        console.log(
          `User ${socket.userId} joined conversation ${conversationId}`,
        );

        socket.emit("conversationJoined", {
          conversationId,
        });
      } catch (error) {
        console.error("Join conversation error:", error);

        socket.emit("messageError", {
          message: "Failed to join conversation",
        });
      }
    });

    // =========================
    // Send Message
    // =========================
    socket.on("sendMessage", async (data) => {
      console.log("📨 sendMessage received:", data);

      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      try {
        const { conversationId, message } = data;

        if (!conversationId || !message?.trim()) {
          return socket.emit("messageError", {
            message: "Conversation ID and message are required",
          });
        }

        if (!ObjectId.isValid(conversationId)) {
          return socket.emit("messageError", {
            message: "Invalid Conversation Id",
          });
        }

        const db = await connection();

        // Check conversation membership
        const conversationCollection = db.collection("conversations");

        const conversation = await conversationCollection.findOne({
          _id: new ObjectId(conversationId),
          participants: new ObjectId(socket.userId),
        });

        if (!conversation) {
          return socket.emit("messageError", {
            message: "You are not a participant of this conversation",
          });
        }

        // Find recipient
        const recipientId = conversation.participants.find(
          (participant) => participant.toString() !== socket.userId.toString(),
        );

        console.log("👤 Recipient ID:", recipientId);

        // Messages collection
        const collection = db.collection(messagesCollection);

        const newMessage = {
          conversationId: new ObjectId(conversationId),
          senderId: new ObjectId(socket.userId),
          message: message.trim(),
          createdAt: new Date(),
        };

        // Save message
        const result = await collection.insertOne(newMessage);

        const savedMessage = {
          _id: result.insertedId,
          ...newMessage,
        };

        console.log("📩 Message saved:", savedMessage);

        // =========================
        // Send to sender
        // =========================
        socket.emit("newMessage", savedMessage);

        // =========================
        // Send to recipient
        // =========================
        io.to(`user:${recipientId}`).emit("newMessage", savedMessage);
      } catch (error) {
        console.error("❌ Send message error:", error);

        socket.emit("messageError", {
          message: "Failed to send message",
        });
      }
    });

    // =========================
    // Disconnect
    // =========================
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);

      console.log("User Disconnected:", socket.id);
      console.log("Online Users:", onlineUsers);
    });
  });
};
