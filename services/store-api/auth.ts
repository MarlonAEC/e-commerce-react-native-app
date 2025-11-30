import { LoginResponse, RefreshTokenResponse, User } from "@/@types/user";
import { storeApi } from ".";

const authApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponse,
      { username: string; password: string }
    >({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { username, password },
      }),
    }),
    refreshToken: builder.mutation<
      RefreshTokenResponse,
      { refreshToken: string; expiresInMins?: number }
    >({
      query: ({ refreshToken, expiresInMins }) => ({
        url: "/auth/refresh",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          refreshToken,
          ...(expiresInMins !== undefined && { expiresInMins }),
        },
        credentials: "include", // Include cookies (e.g., accessToken) in the request
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useGetUserQuery } =
  authApi;
