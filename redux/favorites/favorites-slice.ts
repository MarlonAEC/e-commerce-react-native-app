import { Product } from "@/@types/product";
import { logger } from "@/services/logger";
import { RootState } from "@/store";
import {
  clearFavoritesFromStorage,
  getFavoritesFromStorage,
  saveFavoritesToStorage,
} from "@/utils/favorites-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface FavoritesState {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

/**
 * Load favorites from AsyncStorage
 */
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async () => {
    const favorites = await getFavoritesFromStorage();
    return favorites;
  }
);

/**
 * Add product to favorites
 */
export const addToFavorites = createAsyncThunk(
  "favorites/addToFavorites",
  async (product: Product, { getState }) => {
    const state = getState() as RootState;
    const favorites = state.favorites.favorites;

    // Check if product already exists
    const exists = favorites.some((p) => p.id === product.id);
    if (exists) {
      return favorites; // Already in favorites
    }

    const updatedFavorites = [...favorites, product];
    await saveFavoritesToStorage(updatedFavorites);
    return updatedFavorites;
  }
);

/**
 * Remove product from favorites
 */
export const removeFromFavorites = createAsyncThunk(
  "favorites/removeFromFavorites",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const favorites = state.favorites.favorites;

    const updatedFavorites = favorites.filter((p) => p.id !== productId);
    await saveFavoritesToStorage(updatedFavorites);
    return updatedFavorites;
  }
);

/**
 * Clear all favorites
 */
export const clearFavorites = createAsyncThunk(
  "favorites/clearFavorites",
  async () => {
    await clearFavoritesFromStorage();
    return [];
  }
);

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load favorites
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load favorites";
        logger.error(
          "Failed to load favorites",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Add to favorites
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add to favorites";
        logger.error(
          "Failed to add to favorites",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Remove from favorites
    builder
      .addCase(removeFromFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.error = null;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.error.message || "Failed to remove from favorites";
        logger.error(
          "Failed to remove from favorites",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Clear favorites
    builder
      .addCase(clearFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(clearFavorites.fulfilled, (state) => {
        state.favorites = [];
        state.error = null;
      })
      .addCase(clearFavorites.rejected, (state, action) => {
        state.error = action.error.message || "Failed to clear favorites";
        logger.error(
          "Failed to clear favorites",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });
  },
});

export default favoritesSlice.reducer;
export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectFavoritesLoading = (state: RootState) =>
  state.favorites.isLoading;
export const selectFavoritesError = (state: RootState) =>
  state.favorites.error;
export const selectIsFavorite = (state: RootState, productId: number) =>
  state.favorites.favorites.some((p) => p.id === productId);

