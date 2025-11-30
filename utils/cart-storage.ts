import { Cart } from "@/@types/cart";
import { logger } from "@/services/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const CART_STORAGE_KEY = "@cart";

/**
 * Get cart from AsyncStorage
 */
export async function getCartFromStorage(): Promise<Cart | null> {
  try {
    if (Platform.OS === "web") {
      const cartJson = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartJson) return null;
      return JSON.parse(cartJson) as Cart;
    } else {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (!cartJson) return null;
      return JSON.parse(cartJson) as Cart;
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to get cart from storage", err);
    return null;
  }
}

/**
 * Save cart to AsyncStorage
 */
export async function saveCartToStorage(cart: Cart | null): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (cart === null) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } else {
      if (cart === null) {
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to save cart to storage", err);
  }
}

/**
 * Clear cart from AsyncStorage
 */
export async function clearCartFromStorage(): Promise<void> {
  await saveCartToStorage(null);
}
