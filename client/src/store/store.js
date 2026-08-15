import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
const store = configureStore({
  reducer: {},
});
export default store;
