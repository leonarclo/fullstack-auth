import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3001",
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/login",
          method: "POST",
          body: data,
        };
      },
    }),
    logOut: builder.mutation({
      query: () => {
        return {
          url: "/logout",
          method: "GET",
        };
      },
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: "/user-data",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery, useLogOutMutation } =
  apiSlice;
