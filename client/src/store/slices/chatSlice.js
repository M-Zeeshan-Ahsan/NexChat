import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../services/api";
import API_URLS from "../services/apiUrls";
const initialState = {
  loading: false,
  error: null,
  conversations: [],
  messages: [],
  users: [],

  messagePagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
export const getAllConversations = createAsyncThunk(
  "chat/getAllConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URLS.CHAT.ALL_CONVERSATIONS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }
  },
);
export const getSpecficConversation = createAsyncThunk(
  "chat/getSpecficConversation",
  async ({ conversationId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_URLS.CHAT.GET_SPECIFIC_COVERSATION}/${conversationId}`,
        {
          params: {
            page,
            limit,
          },
        },
      );

      return {
        ...response.data,
        page,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.CHAT.SEND_MESSAGE, {
        conversationId,
        message,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const getAllUsers = createAsyncThunk(
  "chat/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URLS.CHAT.ALL_USERS);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.CHAT.CREATE_CONVERSATION, {
        receiverId: userId,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log("new message test", action.payload);
      state.messages.push(action.payload);
    },
    incrementUnreadCount: (state, action) => {
      const { conversationId } = action.payload;
      const conversation = state.conversations.find(
        (conversation) => conversation.id === conversationId,
      );
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    },
    markConversationAsRead: (state, action) => {
      const conversation = state.conversations.find(
        (item) => item.id === action.payload,
      );

      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    updateLastMessage: (state, action) => {
      const { conversationId, message, createdAt } = action.payload;
      console.log("updateLastMessage", action.payload);
      const conversation = state.conversations.find(
        (item) => item.id === conversationId,
      );

      if (conversation) {
        console.log("test conversation", conversation.lastMessage);
        conversation.lastMessage = {
          message,
          createdAt,
        };
      }
    },
    addConversation: (state, action) => {
      console.log("test", action.payload);
      state.conversations.unshift(action.payload);
    },
    addOlderMessages: (state, action) => {
      state.messages = [...action.payload.messages, ...state.messages];

      state.messagePagination = action.payload.pagination;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
    });
    builder.addCase(getAllConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getSpecficConversation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getSpecficConversation.fulfilled, (state, action) => {
      state.loading = false;

      const { messages, pagination, page } = action.payload;

      if (page === 1) {
        state.messages = messages;
      } else {
        state.messages = [...messages, ...state.messages];
      }

      state.messagePagination = pagination;
    });
    builder.addCase(getSpecficConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.messages.push(action.payload);
      }
    });

    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });

    builder.addCase(createConversation.fulfilled, (state, action) => {
      state.loading = false;
      // state.conversations.unshift(action.payload);
    });
  },
});
export const {
  addMessage,
  addOlderMessages,
  incrementUnreadCount,
  markConversationAsRead,
  updateLastMessage,
  addConversation,
} = chatSlice.actions;
export default chatSlice.reducer;
