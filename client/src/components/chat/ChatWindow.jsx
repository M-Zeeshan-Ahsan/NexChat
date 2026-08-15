import React, { use, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "../../store/slices/chatSlice";
import { showToast } from "../../utils/toast";

const ChatWindow = ({ conversation }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  console.log("user", user);
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      await dispatch(
        sendMessage({
          conversationId: conversation.id,
          message: message.trim(),
        }),
      ).unwrap();
    } catch (error) {
      console.error("Send message error:", error);
      showToast(error, "error");
    }
  };

  if (!conversation) {
    return (
      <section className="chat-window empty-chat">
        <div className="empty-chat-content">
          <div className="empty-icon">💬</div>

          <h2>Select a conversation</h2>

          <p>Choose a conversation from the left to start chatting.</p>
        </div>
      </section>
    );
  }
  const currentUserId = user?.id;
  console.log("currentUserId", currentUserId);
  const formattedMessages = messages.map((message) => ({
    id: message._id,
    text: message.message,
    sender: message.senderId === currentUserId ? "me" : "other",
    time: message.createdAt,
  }));
  return (
    <section className="chat-window">
      <ChatHeader conversation={conversation} />

      <MessageList messages={formattedMessages} />

      <MessageInput onSend={handleSendMessage} />
    </section>
  );
};

export default ChatWindow;
