import React from "react";

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`message-row ${message.sender === "me" ? "sent" : "received"}`}
    >
      <div className="message-bubble">
        <p>{message.text}</p>

        <span>{message.time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
