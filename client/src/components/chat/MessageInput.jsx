import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import FloatingDropdown from "../FloatingDropdown/FloatingDropdown";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);

    setMessage("");
  };
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };
  return (
    <footer className="message-input-wrapper">
      <form onSubmit={handleSubmit}>
        <FloatingDropdown
          open={showEmojiPicker}
          onOpenChange={setShowEmojiPicker}
          placement="top-start"
          trigger={
            <button type="button" className="attachment-btn" title="Emoji">
              😊
            </button>
          }
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + emojiData.emoji);
            }}
          />
        </FloatingDropdown>
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
