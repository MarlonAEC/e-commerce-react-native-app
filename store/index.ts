import categoriesReducer from "@/redux/categories/categories-slice";
import { storeApi } from "@/services/store-api";
import {
  combineReducers,
  configureStore,
  type Middleware,
} from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

const rootReducer = combineReducers({
  categories: categoriesReducer,
  [storeApi.reducerPath]: storeApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // Redux DevTools is automatically enabled in development mode
  // For React Native, you can use:
  // 1. React Native Debugger (recommended) - https://github.com/jhen0409/react-native-debugger
  // 2. Flipper with Redux DevTools plugin
  // 3. Remote Redux DevTools
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
