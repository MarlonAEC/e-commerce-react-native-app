import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-toolkit";
import {
  logout,
  restoreSession,
  setLoginResponse,
  setSessionLoaded,
} from "@/redux/auth/auth-slice";
import { logger } from "@/services/logger";
import { useLoginMutation } from "@/services/store-api/auth";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/secure-storage";
import { router } from "expo-router";
import { useEffect } from "react";

/**
 * Internal hook that manages authentication state using Redux
 * This is used by SessionProvider to provide the Context API
 * External code should use the useSession hook from SessionProvider
 */
export function useSession() {
  const dispatch = useAppDispatch();
  const { accessToken, isLoading } = useAppSelector((state) => state.auth);
  const [loginMutation] = useLoginMutation();

  // Load session from SecureStorage on mount (only once)
  useEffect(() => {
    async function loadSession() {
      try {
        const storedAccessToken = await getAccessToken();
        const storedRefreshToken = await getRefreshToken();

        if (storedAccessToken && storedRefreshToken) {
          // Restore session from SecureStorage
          dispatch(
            restoreSession({
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            })
          );
        } else {
          // No tokens found, mark as loaded (user is not logged in)
          dispatch(setSessionLoaded());
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error("Failed to load session from storage", err);
        // Even on error, mark as loaded so app can continue
        dispatch(setSessionLoaded());
      }
    }

    // Only load if still loading
    if (isLoading) {
      loadSession();
    }
  }, [dispatch, isLoading]);

  const signIn = async (username: string, password: string) => {
    try {
      const result = await loginMutation({ username, password }).unwrap();

      // Store tokens in SecureStorage
      await Promise.all([
        setAccessToken(result.accessToken),
        setRefreshToken(result.refreshToken),
      ]);

      // Update Redux state
      dispatch(setLoginResponse(result));
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Sign in failed", err, { username });
      return false;
    }
  };

  const signOut = async () => {
    // Clear tokens from SecureStorage
    await clearTokens();

    // Update Redux state
    dispatch(logout());

    // Navigate to login
    router.replace("/login");
  };

  return {
    signIn,
    signOut,
    session: accessToken, // Use accessToken as session identifier
    isLoading, // Loading state while checking SecureStorage
  };
}
