import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
