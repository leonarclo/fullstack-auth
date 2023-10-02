import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./authSlice";
import customBaseQuery from "./customBaseQuery";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3001",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.authData?.accessToken;
    // Se existe um token no state, ele será passado aqui
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
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
  if (result.error && result.error.status === 403) {
    // try to get a new token
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log("refresh result: ", refreshResult);
    if (refreshResult.data) {
      const user = (api.getState() as RootState).auth.authData?.user;

      const authData = {
        user,
        accessToken: { ...refreshResult.data },
      };
      // store the new token
      api.dispatch(setCredentials(authData as any));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
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
        url: "login",
        method: "POST",
        body: { ...data },
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
    refresh: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log(data);
          console.log(data.accessToken);
          dispatch(setCredentials(data.accessToken));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUser: builder.query({
      query: () => "user-data",
      keepUnusedDataFor: 5,
      transformResponse: (result: any) => result.data,
      async onQueryStarted({ dispatch, queryFulfilled }) {
        try {
          const userData = await queryFulfilled;
          dispatch(setCredentials(userData));
        } catch (error) {}
      },
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery, useLogOutMutation } =
  apiSlice;
