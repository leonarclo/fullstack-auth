import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3001",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const accessToken = (getState() as RootState).persistedReducer.auth.authData
      ?.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 403) {
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log("refresh result: ", refreshResult);
    if (refreshResult.data) {
      const user = (api.getState() as RootState).persistedReducer.auth;
      const authData = {
        ...user,
        accessToken: JSON.stringify(refreshResult.data),
      };
      console.log(`REFRESH: ${authData}`);

      api.dispatch(setCredentials(authData));

      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("refresh result error");
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logOut: builder.mutation({
      query: () => {
        return {
          url: "/logout",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useLogOutMutation } = apiSlice;
