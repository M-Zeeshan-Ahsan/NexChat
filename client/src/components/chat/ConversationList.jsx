import React, { useState } from "react";
import ConversationItem from "./ConversationItem";
import { useSelector } from "react-redux";
import NewChat from "./NewChat";

const ConversationList = ({ selectedConversation, onSelectConversation }) => {
  const { conversations, loading, error } = useSelector((state) => state.chat);
  console.log("conversations", conversations);
  const [showNewChat, setShowNewChat] = useState(false);

  const hasConversations = conversations?.length > 0;

  return (
    <>
      <aside className="conversation-list">
        <div className="conversation-header">
          <h2>Messages</h2>

          <button className="new-chat-btn" onClick={() => setShowNewChat(true)}>
            +
          </button>
        </div>

        {hasConversations && (
          <div className="conversation-search">
            <input type="text" placeholder="Search conversations..." />
          </div>
        )}

        <div
          className={`conversations ${
            !hasConversations ? "empty-conversations" : ""
          }`}
        >
          {false ? (
            <div className="conversation-loading">Loading...</div>
          ) : hasConversations ? (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                selected={selectedConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))
          ) : (
            <div className="empty-conversation">
              <div className="empty-chat-icon">💬</div>

              <h3>No conversations yet</h3>

              <p>Start a new conversation with someone from your contacts.</p>

              <button
                className="start-chat-btn"
                onClick={() => setShowNewChat(true)}
              >
                <span>+</span>
                Start New Conversation
              </button>
            </div>
          )}
        </div>
      </aside>

      {showNewChat && (
        <NewChat
          onClose={() => setShowNewChat(false)}
          onConversationCreated={(conversation) => {
            onSelectConversation(conversation);
          }}
        />
      )}
    </>
  );
};

export default ConversationList;
