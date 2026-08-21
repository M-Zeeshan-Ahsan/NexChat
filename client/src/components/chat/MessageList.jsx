import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, onLoadMore, hasMore, loadingMore }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const previousScrollHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const userScrollEnabledRef = useRef(false);
  const initialLoadDoneRef = useRef(false);

  const lastMessageIdRef = useRef(null);
  const firstMessageIdRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!userScrollEnabledRef.current) return;
    if (!initialLoadDoneRef.current) return;

    const isScrollable = container.scrollHeight > container.clientHeight;
    if (!isScrollable) return;

    if (
      container.scrollTop <= 5 &&
      hasMore &&
      !loadingMore &&
      !isLoadingMoreRef.current
    ) {
      previousScrollHeightRef.current = container.scrollHeight;
      previousScrollTopRef.current = container.scrollTop;
      isLoadingMoreRef.current = true;
      onLoadMore();
    }
  };

  useEffect(() => {
    if (!messages.length) return;

    const container = containerRef.current;
    if (!container) return;

    const newFirstId = messages[0]?.id;
    const newLastId = messages[messages.length - 1]?.id;

    // Bilkul pehli dafa (app open hote hi)
    if (!userScrollEnabledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      initialLoadDoneRef.current = true;
      firstMessageIdRef.current = newFirstId;
      lastMessageIdRef.current = newLastId;
      return;
    }

    // NEW: CHAT SWITCH detect karo — first aur last dono ids badal gayi
    // (aur ye older-messages load ki wajah se nahi hai)
    const isChatSwitch =
      !isLoadingMoreRef.current &&
      firstMessageIdRef.current !== null &&
      newFirstId !== firstMessageIdRef.current &&
      newLastId !== lastMessageIdRef.current;

    if (isChatSwitch) {
      console.log("🔁 CHAT SWITCH DETECTED → scroll to bottom");
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      firstMessageIdRef.current = newFirstId;
      lastMessageIdRef.current = newLastId;
      return;
    }

    // Older messages load hue
    if (isLoadingMoreRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference =
            newScrollHeight - previousScrollHeightRef.current;

          container.scrollTop = previousScrollTopRef.current + heightDifference;

          isLoadingMoreRef.current = false;
          firstMessageIdRef.current = newFirstId;
          lastMessageIdRef.current = newLastId;
        });
      });
      return;
    }

    // Sirf tab bottom scroll karo jab END par genuinely naya message aaya ho
    const isGenuinelyNewAtEnd =
      newLastId !== lastMessageIdRef.current &&
      newFirstId === firstMessageIdRef.current;

    if (isGenuinelyNewAtEnd) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    firstMessageIdRef.current = newFirstId;
    lastMessageIdRef.current = newLastId;
  }, [messages]);

  const handleWheel = () => {
    userScrollEnabledRef.current = true;
  };
  const handleTouchMove = () => {
    userScrollEnabledRef.current = true;
  };

  return (
    <div
      className="message-list"
      ref={containerRef}
      onScroll={handleScroll}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
    >
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
