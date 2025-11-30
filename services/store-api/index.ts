import { RefreshTokenResponse } from "@/@types/user";
import { logout, refreshTokens } from "@/redux/auth/auth-slice";
import { RootState } from "@/store";
import { setAccessToken, setRefreshToken } from "@/utils/secure-storage";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// Create base query with prepareHeaders to add auth token
const baseQuery = fetchBaseQuery({
  baseUrl: "https://dummyjson.com/",
  prepareHeaders: (headers, { getState }) => {
    // Get the access token from Redux state
    const token = (getState() as RootState).auth.accessToken;

    // If we have a token, add it to the headers
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Track if we're currently refreshing to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Base query with automatic re-authorization
 * Follows the official Redux Toolkit pattern:
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
 *
 * Includes prevention of multiple unauthorized errors by tracking refresh state
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If we're already refreshing, wait for that to complete
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
      // Retry the original query after refresh completes
      result = await baseQuery(args, api, extraOptions);
      return result;
    }

    // Start refresh process
    isRefreshing = true;
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: {
                refreshToken,
                expiresInMins: 30,
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { accessToken, refreshToken: newRefreshToken } =
              refreshResult.data as RefreshTokenResponse;

            // Store the new token in Redux
            api.dispatch(
              refreshTokens({ accessToken, refreshToken: newRefreshToken })
            );

            // Store the new token in SecureStorage
            await Promise.all([
              setAccessToken(accessToken),
              setRefreshToken(newRefreshToken),
            ]);
          } else {
            // Refresh failed - logout user
            api.dispatch(logout());
          }
        } catch {
          // Refresh failed - logout user
          api.dispatch(logout());
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      await refreshPromise;

      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // No refresh token - logout user
      isRefreshing = false;
      refreshPromise = null;
      api.dispatch(logout());
    }
  }

  return result;
};

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
