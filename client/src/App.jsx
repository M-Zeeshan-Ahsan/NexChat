import { useState } from "react";
import "./styles/App.scss";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Protected from "./middleware/protected";
function App() {
  return (
    <>
      <Routes>
        {" "}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/"
          element={
            <Protected>
              <ListTask />
            </Protected>
          }
        />
        <Route
          path="/add"
          element={
            <Protected>
              <AddTask />
            </Protected>
          }
        />
        <Route path="/update/:id" element={<UpdateTask />} /> */}
      </Routes>
    </>
  );
}

export default App;
