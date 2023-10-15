import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "../customFetchBase";
import { IUserData, setCredentials } from "../auth/slice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customFetchBase,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query() {
        return {
          url: "/user-data",
          credentials: "include",
        };
      },
      transformResponse: (result: { data: { user: IUserData } }) =>
        result.data.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {}
      },
    }),
  }),
});

export const { useGetUserQuery } = userApi;
