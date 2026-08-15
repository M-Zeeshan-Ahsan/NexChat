import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How are you?",
      sender: "other",
      time: "10:25 AM",
    },
    {
      id: 2,
      text: "I'm good. How about you?",
      sender: "me",
      time: "10:26 AM",
    },
    {
      id: 3,
      text: "I'm doing great!",
      sender: "other",
      time: "10:27 AM",
    },
    {
      id: 4,
      text: "Are you working on the chat application?",
      sender: "other",
      time: "10:28 AM",
    },
    {
      id: 5,
      text: "Yes, I'm working on it right now.",
      sender: "me",
      time: "10:29 AM",
    },
  ]);

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
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

  return (
    <section className="chat-window">
      <ChatHeader conversation={conversation} />

      <MessageList messages={messages} />

      <MessageInput onSend={handleSendMessage} />
    </section>
  );
};

export default ChatWindow;
