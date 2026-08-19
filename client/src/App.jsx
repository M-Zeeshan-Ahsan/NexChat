import { useState, useEffect } from "react";
import "./styles/App.scss";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Protected from "./middleware/protected";
import Chat from "./pages/chat/chat";
import { connectSocket, disconnectSocket } from "./socket/socket";
import SocketListeners from "./socket/SocketListeners";
function App() {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);
  return (
    <>
      <SocketListeners />
      <Routes>
        {" "}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
