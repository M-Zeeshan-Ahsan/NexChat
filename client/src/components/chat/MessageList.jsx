import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, onLoadMore, hasMore, loadingMore }) => {
  const containerRef = useRef(null);

  const previousScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    if (container.scrollTop === 0) {
      if (!hasMore || loadingMore) return;

      // API call se pehle current height save
      previousScrollHeightRef.current = container.scrollHeight;

      onLoadMore();
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !messages.length) return;

    // First conversation load
    if (isInitialLoadRef.current) {
      container.scrollTop = container.scrollHeight;

      isInitialLoadRef.current = false;

      return;
    }

    // Older messages loaded
    const newScrollHeight = container.scrollHeight;

    container.scrollTop = newScrollHeight - previousScrollHeightRef.current;
  }, [messages]);

  return (
    <div ref={containerRef} className="message-list" onScroll={handleScroll}>
      <div className="messages-container">
        {loadingMore && <div>Loading...</div>}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
