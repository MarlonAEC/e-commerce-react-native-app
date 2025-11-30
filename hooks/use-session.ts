import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-toolkit";
import {
  logout,
  restoreSession,
  setLoginResponse,
  setSessionLoaded,
  setUser,
} from "@/redux/auth/auth-slice";
import { logger } from "@/services/logger";
import {
  useGetUserQuery,
  useLoginMutation,
  useRefreshTokenMutation,
} from "@/services/store-api/auth";
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
  const { accessToken, refreshToken, isLoading, user } = useAppSelector(
    (state) => state.auth
  );
  const [loginMutation] = useLoginMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Fetch user data when we have an access token but no user
  const {
    data: userData,
    isLoading: isFetchingUser,
    error: userError,
  } = useGetUserQuery(undefined, {
    skip: !accessToken || !!user, // Skip if no token or user already exists
  });

  // Track if we need to mark session as loaded after user fetch
  const shouldMarkLoaded = accessToken && !user && !isFetchingUser;

  // Update user in Redux when fetched
  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [userData, dispatch]);

  // Mark session as loaded after user is fetched (success or error)
  useEffect(() => {
    if (shouldMarkLoaded) {
      // User fetch completed (either success or error)
      dispatch(setSessionLoaded());

      // Log error if user fetch failed
      if (userError) {
        const error =
          userError instanceof Error
            ? userError
            : new Error(
                "status" in userError
                  ? `Failed to fetch user: ${userError.status}`
                  : "Failed to fetch user data"
              );
        logger.error("Failed to fetch user data", error);
      }
    }
  }, [shouldMarkLoaded, userError, dispatch]);

  // Load session from SecureStorage on mount (only once)
  useEffect(() => {
    async function loadSession() {
      try {
        const storedAccessToken = await getAccessToken();
        const storedRefreshToken = await getRefreshToken();

        if (storedAccessToken && storedRefreshToken) {
          // Try to refresh the token proactively to ensure it's valid
          // If refresh fails, the automatic refresh on 401 will handle it
          try {
            const refreshResult = await refreshTokenMutation({
              refreshToken: storedRefreshToken,
              expiresInMins: 30,
            }).unwrap();

            // Update tokens with refreshed ones
            await Promise.all([
              setAccessToken(refreshResult.accessToken),
              setRefreshToken(refreshResult.refreshToken),
            ]);

            // Restore session with refreshed tokens
            dispatch(
              restoreSession({
                accessToken: refreshResult.accessToken,
                refreshToken: refreshResult.refreshToken,
              })
            );
          } catch (refreshError) {
            // If refresh fails, still try to restore with stored tokens
            // The automatic refresh on 401 will handle expired tokens
            const err =
              refreshError instanceof Error
                ? refreshError
                : new Error(String(refreshError));
            logger.warn("Failed to refresh token on session restore", {
              error: err.message,
            });
            dispatch(
              restoreSession({
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
              })
            );
          }
          // User will be fetched automatically by useGetUserQuery
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
  }, [dispatch, isLoading, refreshTokenMutation]);

  const signIn = async (username: string, password: string) => {
    try {
      const result = await loginMutation({ username, password }).unwrap();

      // Store tokens in SecureStorage
      await Promise.all([
        setAccessToken(result.accessToken),
        setRefreshToken(result.refreshToken),
      ]);

      // Update Redux state with tokens
      dispatch(setLoginResponse(result));

      // User will be fetched automatically by useGetUserQuery
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
    refreshToken,
    session: accessToken, // Use accessToken as session identifier
    isLoading, // Loading state while checking SecureStorage
  };
}
