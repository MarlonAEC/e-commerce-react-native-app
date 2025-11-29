import { LoginResponse, User } from "@/@types/user";
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
    getUser: builder.query<User, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useLoginMutation } = authApi;
