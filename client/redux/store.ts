import { authApi } from "./auth/api";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { userApi } from "./user/api";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    authState: authReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([authApi.middleware, userApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
