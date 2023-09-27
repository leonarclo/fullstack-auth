import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/authSlice";
import { apiSlice } from "./features/apiSlice";

const store = configureStore({
  reducer: { auth: AuthReducer, [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export default store;
