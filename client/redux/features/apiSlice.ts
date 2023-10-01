import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUserData, logOut, setCredentials } from "./authSlice";
import customBaseQuery from "./customBaseQuery";

export const apiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query(data) {
        return {
          url: "login",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;
      //     await dispatch(setCredentials(null));
      //   } catch (error) {}
      // },
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
