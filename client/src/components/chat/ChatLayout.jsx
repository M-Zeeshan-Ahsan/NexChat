import React, { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="chat-layout">
      <ConversationList
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />

      <ChatWindow conversation={selectedConversation} />
    </div>
  );
};

export default ChatLayout;
