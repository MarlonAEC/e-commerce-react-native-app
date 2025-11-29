import { BaseCategoryFromApi } from "@/@types/categories";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.escuelajs.co/api/v1/" }),
  endpoints: (builder) => ({
    getCategories: builder.query<BaseCategoryFromApi[], void>({
      query: () => "/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = storeApi;
