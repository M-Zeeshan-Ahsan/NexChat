import React from "react";
import Avatar from "../../shared/Avatar";

const ConversationItem = ({ conversation, selected, onClick }) => {
  return (
    <div
      className={`conversation-item ${selected ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="avatar-wrapper">
        <Avatar src={conversation.avatar} name={conversation.name} size={48} />

        {conversation.online && <span className="online-dot" />}
      </div>

      <div className="conversation-content">
        <div className="conversation-top">
          <h4>{conversation.name}</h4>

          <span className="conversation-time">{conversation.time}</span>
        </div>

        <div className="conversation-bottom">
          <p>{conversation.lastMessage}</p>

          {conversation.unread > 0 && (
            <span className="unread-count">{conversation.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
