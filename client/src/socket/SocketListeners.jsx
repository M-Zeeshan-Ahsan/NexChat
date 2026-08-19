import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";
import socket from "./socket";

const SocketListeners = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("📩 New message received:", message);

      dispatch(addMessage(message));
    };

    const handleMessageError = (error) => {
      console.error("❌ Socket message error:", error.message);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageError", handleMessageError);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageError", handleMessageError);
    };
  }, [dispatch]);

  return null;
};

export default SocketListeners;
