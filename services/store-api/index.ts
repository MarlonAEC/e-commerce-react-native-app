import { BaseCategoryFromApi } from "@/@types/categories";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/" }),
  endpoints: (builder) => ({
    getCategories: builder.query<BaseCategoryFromApi[], void>({
      query: () => "/products/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = storeApi;
