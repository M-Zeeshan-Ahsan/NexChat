import React from "react";
import Avatar from "../../shared/Avatar";
import FormattedDate from "../../shared/FormattedDate";

const ConversationItem = ({ conversation, selected, onClick }) => {
  return (
    <div
      className={`conversation-item ${selected ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="avatar-wrapper">
        <Avatar
          src={conversation.chatuser.avatar}
          name={conversation.chatuser.name}
          size={48}
        />

        {conversation.online && <span className="online-dot" />}
      </div>

      <div className="conversation-content">
        <div className="conversation-top">
          <h4>{conversation.chatuser.name}</h4>

          <span className="conversation-time">
            <FormattedDate date={conversation.createdAt} showTime />
          </span>
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
