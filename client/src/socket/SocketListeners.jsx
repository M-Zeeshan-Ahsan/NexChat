import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addMessage,
  incrementUnreadCount,
  updateLastMessage,
  addConversation,
} from "../store/slices/chatSlice";

import socket from "./socket";

const SocketListeners = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const currentUserId = user?.id;

  useEffect(() => {
    // =========================
    // New Message
    // =========================
    const handleNewMessage = (message) => {
      console.log("📩 New message received:", message);

      dispatch(addMessage(message));

      dispatch(
        updateLastMessage({
          conversationId: message.conversationId.toString(),
          message: message.message,
          createdAt: message.createdAt,
        }),
      );

      if (message.senderId.toString() !== currentUserId?.toString()) {
        dispatch(
          incrementUnreadCount({
            conversationId: message.conversationId.toString(),
          }),
        );
      }
    };

    // =========================
    // New Conversation
    // =========================
    const handleNewConversation = (conversation) => {
      console.log("🆕 New conversation received:", conversation);

      dispatch(addConversation(conversation));
    };

    // =========================
    // Message Error
    // =========================
    const handleMessageError = (error) => {
      console.error("❌ Socket message error:", error.message);
    };

    socket.on("newMessage", handleNewMessage);

    socket.on("newConversation", handleNewConversation);

    socket.on("messageError", handleMessageError);

    return () => {
      socket.off("newMessage", handleNewMessage);

      socket.off("newConversation", handleNewConversation);

      socket.off("messageError", handleMessageError);
    };
  }, [dispatch, currentUserId]);

  return null;
};

export default SocketListeners;
