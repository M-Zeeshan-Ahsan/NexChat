import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useSelector, useDispatch } from "react-redux";
import {
  markConversationAsRead,
  getSpecficConversation,
} from "../../store/slices/chatSlice";
import { showToast } from "../../utils/toast";
import socket from "../../socket/socket";

const ChatWindow = ({ conversation }) => {
  const dispatch = useDispatch();
  const { messages, messagePagination } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [loadingMore, setLoadingMore] = useState(false);
  // const handleSendMessage = async (message) => {
  //   if (!message.trim()) return;

  //   try {
  //     await dispatch(
  //       sendMessage({
  //         conversationId: conversation.id,
  //         message: message.trim(),
  //       }),
  //     ).unwrap();
  //   } catch (error) {
  //     console.error("Send message error:", error);
  //     showToast(error, "error");
  //   }
  // };
  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    if (!conversation?.id) return;

    socket.emit("sendMessage", {
      conversationId: conversation.id,
      message: message.trim(),
    });
  };

  useEffect(() => {
    if (!conversation?.id) return;

    console.log("Joining conversation:", conversation.id);

    dispatch(markConversationAsRead(conversation.id));
    socket.emit("joinConversation", conversation.id);

    socket.on("conversationJoined", (data) => {
      console.log("✅ Conversation joined:", data);
    });

    socket.on("messageError", (error) => {
      console.error("❌ Socket error:", error.message);
    });

    return () => {
      socket.off("conversationJoined");
      socket.off("messageError");
    };
  }, [conversation?.id, dispatch]);

  const loadMoreMessages = async () => {
    if (!conversation?.id || loadingMore) return;

    const { page, totalPages } = messagePagination;

    if (page >= totalPages) return;

    try {
      setLoadingMore(true);

      await dispatch(
        getSpecficConversation({
          conversationId: conversation.id,
          page: page + 1,
          limit: 10,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Load older messages error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // useEffect(() => {
  //   const handleNewMessage = (message) => {
  //     console.log("📩 New message received:", message);

  //     dispatch(addMessage(message));
  //   };

  //   socket.on("newMessage", handleNewMessage);

  //   return () => {
  //     socket.off("newMessage", handleNewMessage);
  //   };
  // }, [dispatch]);
  if (!conversation) {
    return (
      <section className="chat-window empty-chat">
        <div className="empty-chat-content">
          <div className="empty-icon">💬</div>

          <h2>Select a conversation</h2>

          <p>Choose a conversation from the left to start chatting.</p>
        </div>
      </section>
    );
  }
  const currentUserId = user?.id;
  console.log("currentUserId", currentUserId);
  const formattedMessages = messages.map((message) => ({
    id: message._id,
    text: message.message,
    sender: message.senderId === currentUserId ? "me" : "other",
    time: message.createdAt,
  }));
  return (
    <section className="chat-window">
      <ChatHeader conversation={conversation} />

      <MessageList
        messages={formattedMessages}
        onLoadMore={loadMoreMessages}
        hasMore={messagePagination.page < messagePagination.totalPages}
        loadingMore={loadingMore}
      />

      <MessageInput onSend={handleSendMessage} />
    </section>
  );
};

export default ChatWindow;
