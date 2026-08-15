import React from "react";
import ConversationItem from "./ConversationItem";

const conversations = [
  {
    id: 1,
    name: "Ali Ahmed",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Okay, I'll check it.",
    time: "10:32 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Hamza Khan",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Are you available?",
    time: "09:45 AM",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Usman",
    avatar: "https://i.pravatar.cc/150?img=14",
    lastMessage: "Thanks!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Ahmed Raza",
    avatar: "https://i.pravatar.cc/150?img=15",
    lastMessage: "Let's talk tomorrow.",
    time: "Yesterday",
    unread: 5,
    online: false,
  },
];

const ConversationList = ({ selectedConversation, onSelectConversation }) => {
  return (
    <aside className="conversation-list">
      <div className="conversation-header">
        <h2>Messages</h2>

        <button className="new-chat-btn">+</button>
      </div>

      <div className="conversation-search">
        <input type="text" placeholder="Search conversations..." />
      </div>

      <div className="conversations">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            selected={selectedConversation?.id === conversation.id}
            onClick={() => onSelectConversation(conversation)}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
