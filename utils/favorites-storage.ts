import { Product } from "@/@types/product";
import { logger } from "@/services/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const FAVORITES_STORAGE_KEY = "@favorites";

/**
 * Get favorites from AsyncStorage
 */
export async function getFavoritesFromStorage(): Promise<Product[]> {
  try {
    if (Platform.OS === "web") {
      const favoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!favoritesJson) return [];
      return JSON.parse(favoritesJson) as Product[];
    } else {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!favoritesJson) return [];
      return JSON.parse(favoritesJson) as Product[];
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to get favorites from storage", err);
    return [];
  }
}

/**
 * Save favorites to AsyncStorage
 */
export async function saveFavoritesToStorage(
  favorites: Product[]
): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } else {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to save favorites to storage", err);
  }
}

/**
 * Clear favorites from AsyncStorage
 */
export async function clearFavoritesFromStorage(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } else {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to clear favorites from storage", err);
  }
}

