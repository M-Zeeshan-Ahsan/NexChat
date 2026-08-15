import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);

    setMessage("");
  };

  return (
    <footer className="message-input-wrapper">
      <form onSubmit={handleSubmit}>
        <button type="button" className="attachment-btn" title="Attach file">
          +
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="send-btn" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;
