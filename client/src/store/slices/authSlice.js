import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../services/api";
import API_URLS from "../services/apiUrls";
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
  loading: false,
  error: null,
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.AUTH.SIGNUP, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.AUTH.LOGIN, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;

      const user = action.payload.data;
      state.user = user;
      state.token = action.payload.accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", action.payload.accessToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;
