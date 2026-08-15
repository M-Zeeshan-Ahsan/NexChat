import { io } from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2Q3MWUyZTZkZGY5OWI3MGI2YzMxYSIsImVtYWlsIjoiYWxpQGdtYWlsLmNvbSIsImlhdCI6MTc4NjYwNjMyNCwiZXhwIjoxNzg2NjkyNzI0fQ.RzFJqjVS1MP6Kd9TB25BTjSA9IJaWsLZ3XD_sxF7xKU";

const conversationId = "6a7d7288e6ddf99b70b6c31b";

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

// =========================
// Connected
// =========================

socket.on("connect", () => {
  console.log("✅ Connected");
  console.log("Socket Id:", socket.id);

  // Join conversation
  socket.emit("joinConversation", conversationId);
});

// =========================
// Conversation Joined
// =========================

socket.on("conversationJoined", ({ conversationId }) => {
  console.log("✅ Joined Conversation:", conversationId);

  // Send message
  socket.emit("sendMessage", {
    conversationId,
    message: "Hello, this is my first real-time message!",
  });
});

// =========================
// New Message
// =========================

socket.on("newMessage", (message) => {
  console.log("📩 New Message:", message);
});

// =========================
// Message Error
// =========================

socket.on("messageError", (error) => {
  console.log("❌ Message Error:", error.message);
});

// =========================
// Connection Error
// =========================

socket.on("connect_error", (error) => {
  console.log("❌ Connection Error:", error.message);
});

// =========================
// Disconnect
// =========================

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});
