import { io } from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2Q3MWUyZTZkZGY5OWI3MGI2YzMxYSIsImVtYWlsIjoiYWxpQGdtYWlsLmNvbSIsImlhdCI6MTc4NjYwNjMyNCwiZXhwIjoxNzg2NjkyNzI0fQ.RzFJqjVS1MP6Kd9TB25BTjSA9IJaWsLZ3XD_sxF7xKU";

const conversationId = "6a7d7288e6ddf99b70b6c31b";

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ User 1 Connected:", socket.id);

  socket.emit("joinConversation", conversationId);
});

socket.on("conversationJoined", ({ conversationId }) => {
  console.log("✅ User 1 Joined:", conversationId);

  socket.emit("sendMessage", {
    conversationId,
    message: "Hello User 2 👋",
  });
});

socket.on("newMessage", (message) => {
  console.log("📩 User 1 received:", message);
});

socket.on("messageError", (error) => {
  console.log("❌ Error:", error.message);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection Error:", error.message);
});
