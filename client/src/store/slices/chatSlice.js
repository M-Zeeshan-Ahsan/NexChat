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
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_URLS.CHAT.GET_SPECIFIC_COVERSATION}/${conversationId}`,
      );
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
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
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
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
      state.messages = action.payload;
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
  },
});
export default chatSlice.reducer;
