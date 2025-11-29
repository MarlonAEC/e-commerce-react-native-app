import { categories } from "@/constants/categories";
import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: categories,
  },
  reducers: {},
});

export default categoriesSlice.reducer;
export const selectCategories = (state: RootState) =>
  state.categories.categories;
