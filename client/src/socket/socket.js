import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ Socket: Token not found");
    return;
  }

  socket.auth = {
    token,
  };

  socket.connect();
};

socket.on("connect", () => {
  console.log("✅ Socket Connected");
  console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket Connection Error:", error.message);
});

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
