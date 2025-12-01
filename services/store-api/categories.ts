import { BaseCategoryFromApi } from "@/@types/categories";
import { ProductsResponse } from "@/@types/product";
import { storeApi } from ".";

const categoriesApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<BaseCategoryFromApi[], void>({
      query: () => "/products/categories",
    }),
    getCategoryList: builder.query<string[], void>({
      query: () => "/products/category-list",
    }),
    getProductsByCategory: builder.query<
      ProductsResponse,
      { category: string; skip?: number; limit?: number }
    >({
      query: ({ category, skip = 0, limit = 16 }) =>
        `/products/category/${category}?skip=${skip}&limit=${limit}`,
    }),
    getAllProducts: builder.query<
      ProductsResponse,
      { skip?: number; limit?: number }
    >({
      query: ({ skip = 0, limit = 16 }) =>
        `/products?skip=${skip}&limit=${limit}`,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryListQuery,
  useGetProductsByCategoryQuery,
  useGetAllProductsQuery,
} = categoriesApi;
