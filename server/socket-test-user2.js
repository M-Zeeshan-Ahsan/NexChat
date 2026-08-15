import { io } from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2Q0YjRlNTVjMDkyMjNiOTUxOWI5YiIsImVtYWlsIjoiemVlc2hhbkBnbWFpbC5jb20iLCJpYXQiOjE3ODY2MDk1MzksImV4cCI6MTc4NjY5NTkzOX0.sEdxnyLpJbWLAvZdmZExHJwG-6t6nC06sQbVb3OzrB8";

const conversationId = "6a7d7288e6ddf99b70b6c31b";

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("✅ User 2 Connected:", socket.id);

  socket.emit("joinConversation", conversationId);
});

socket.on("conversationJoined", ({ conversationId }) => {
  console.log("✅ User 2 Joined:", conversationId);
});

socket.on("newMessage", (message) => {
  console.log("📩 User 2 received:", message);
});

socket.on("messageError", (error) => {
  console.log("❌ Error:", error.message);
});

socket.on("connect_error", (error) => {
  console.log("❌ Connection Error:", error.message);
});
