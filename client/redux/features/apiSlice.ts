import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:3001" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["UserData"],
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => "/user-data",
    }),
  }),
});

export const { useGetUserDataQuery } = apiSlice;
