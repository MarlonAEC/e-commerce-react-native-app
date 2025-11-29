import { logger } from "@/services/logger";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Store access token in secure storage
 */
export async function setAccessToken(token: string | null): Promise<void> {
  if (Platform.OS === "web") {
    // On web, use localStorage as fallback
    if (token === null) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  } else {
    if (token === null) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    }
  }
}

/**
 * Get access token from secure storage
 */
export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      logger.error("Local storage is unavailable", error, {
        operation: "getAccessToken",
      });
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      logger.error("SecureStore is unavailable", error, {
        operation: "getAccessToken",
      });
      return null;
    }
  }
}

/**
 * Store refresh token in secure storage
 */
export async function setRefreshToken(token: string | null): Promise<void> {
  if (Platform.OS === "web") {
    // On web, use localStorage as fallback
    if (token === null) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  } else {
    if (token === null) {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } else {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    }
  }
}

/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      logger.error("Local storage is unavailable", error, {
        operation: "getRefreshToken",
      });
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      logger.error("SecureStore is unavailable", error, {
        operation: "getRefreshToken",
      });
      return null;
    }
  }
}

/**
 * Clear all tokens from secure storage
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    setAccessToken(null),
    setRefreshToken(null),
  ]);
}

