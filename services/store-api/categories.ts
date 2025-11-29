import { BaseCategoryFromApi } from "@/@types/categories";
import { storeApi } from ".";

const categoriesApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<BaseCategoryFromApi[], void>({
      query: () => "/products/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;
