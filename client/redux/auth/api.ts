import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../customFetchBase";
import { userApi } from "../user/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    register: builder.mutation({
      query(data) {
        return {
          url: "/register",
          method: "POST",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query(data) {
        return {
          url: "/login",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getUser.initiate(null));
        } catch (error) {}
      },
    }),
    logOut: builder.query({
      query: () => {
        return {
          url: "/logout",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useLogOutQuery } = authApi;
