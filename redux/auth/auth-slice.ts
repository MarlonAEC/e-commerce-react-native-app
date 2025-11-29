import { LoginResponse, User } from "@/@types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Loading state while checking SecureStorage
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      // Store tokens from login response
      // Note: LoginResponse doesn't have full User data, so we'll need to fetch it separately
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    restoreSession: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setSessionLoaded: (state) => {
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  setLoginResponse,
  restoreSession,
  setSessionLoaded,
  setUser,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
