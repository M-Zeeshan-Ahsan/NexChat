import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../shared/Avatar";
import {
  getAllUsers,
  createConversation,
  getAllConversations,
} from "../../store/slices/chatSlice";
import "../../styles/chat.scss";
import { showToast } from "../../utils/toast";

const NewChat = ({ onClose, onConversationCreated }) => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleUserSelect = async (user) => {
    try {
      const conversation = await dispatch(
        createConversation(user._id),
      ).unwrap();

      await dispatch(getAllConversations()).unwrap();

      onConversationCreated(conversation);
      onClose();
    } catch (error) {
      console.error("Create conversation error:", error);

      showToast(error || "Unable to create conversation", "error");
    }
  };

  return (
    <div className="new-chat-overlay" onClick={onClose}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="new-chat-header">
          <div>
            <h2>New Chat</h2>
            <p>Select a user to start chatting</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="users-list">
          {loading ? (
            <div className="users-loading">Loading users...</div>
          ) : users?.length === 0 ? (
            <div className="users-empty">No users found</div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => handleUserSelect(user)}
              >
                <Avatar src={user.profileImage} name={user.name} size={48} />

                <div className="user-info">
                  <h4>{user.name}</h4>
                  <span>{user.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChat;
