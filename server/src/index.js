import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { socketConnection } from "./sockets/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// HTTP Server
const server = http.createServer(app);

// Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket Connection
socketConnection(io);

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
