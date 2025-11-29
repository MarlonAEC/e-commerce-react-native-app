import categoriesReducer from "@/redux/categories/categories-slice";
import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
  // Redux DevTools is automatically enabled in development mode
  // For React Native, you can use:
  // 1. React Native Debugger (recommended) - https://github.com/jhen0409/react-native-debugger
  // 2. Flipper with Redux DevTools plugin
  // 3. Remote Redux DevTools
  devTools: __DEV__,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
