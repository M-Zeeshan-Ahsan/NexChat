import React, { useEffect, useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useDispatch } from "react-redux";
import {
  getAllConversations,
  getSpecficConversation,
} from "../../store/slices/chatSlice";

const ChatLayout = () => {
  const dispatch = useDispatch();

  const [selectedConversation, setSelectedConversation] = useState(null);
  console.log("selectedConversation", selectedConversation);
  useEffect(() => {
    dispatch(getAllConversations());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedConversation?.id) return;
    dispatch(getSpecficConversation(selectedConversation.id));
  }, [dispatch, selectedConversation]);

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
