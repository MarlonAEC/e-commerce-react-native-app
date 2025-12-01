import authReducer from "@/redux/auth/auth-slice";
import cartReducer from "@/redux/cart/cart-slice";
import categoriesReducer from "@/redux/categories/categories-slice";
import favoritesReducer from "@/redux/favorites/favorites-slice";
import { storeApi } from "@/services/store-api";
import {
  combineReducers,
  configureStore,
  type Middleware,
} from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

// Import feature modules to ensure endpoints are injected into storeApi
// This must happen after storeApi is imported but before the store is configured
import "@/services/store-api/auth";
import "@/services/store-api/categories";

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoriesReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  [storeApi.reducerPath]: storeApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,

  devTools: __DEV__,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return defaultMiddleware.concat(
      storeApi.middleware
    ) as unknown as typeof defaultMiddleware & readonly Middleware[];
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
