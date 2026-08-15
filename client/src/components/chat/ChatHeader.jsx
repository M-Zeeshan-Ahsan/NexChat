import React from "react";
import Avatar from "../../shared/Avatar";

const ChatHeader = ({ conversation }) => {
  return (
    <header className="chat-header">
      <div className="chat-user">
        <div className="avatar-wrapper">
          <Avatar
            src={conversation.avatar}
            name={conversation.chatuser.name}
            size={48}
          />
          {conversation.online && <span className="online-dot" />}
        </div>

        <div>
          <h3>{conversation.chatuser.name}</h3>

          <span>{conversation.online ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="chat-actions">
        <button title="Search">⌕</button>
        <button title="More">⋮</button>
      </div>
    </header>
  );
};

export default ChatHeader;
