# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Design

For the designs I used this figma project as reference:

https://www.figma.com/community/file/1131440097475381135

All the credits to the original owner.

I didn't followed the design 100% just used as a visual reference to build a basic MVP.

## Technical considerations.

For the data I'm using this [API](https://dummyjson.com/docs) it's a quite simple and straight forward API with a bunch of dummy data. Although, it's good to mention that I didn't used the Cart endpoint on this API for the assessment just followed the instructions and implemented the cart functionality using the AsyncStorage for simplicity since th API cart endpoint didn't had persistence capabilities. For state management I'm using [Redux Toolkit](https://redux-toolkit.js.org/)

IMPORTANT:
You can use this credential to login into the app (without the quotes):

```
- username: "emilys"
- password: "emilyspass"
```

### Internationalization

The project has support for several locales which you can switch in the profile page once you login.

### Project structure

The project is organized as follows:

#### `app/`

Contains all application screens and routes using Expo Router's file-based routing system. The `_layout.tsx` files define navigation structure, while screen files (e.g., `login.tsx`, `index.tsx`) represent individual routes. The `(tabs)` folder groups tab navigation screens (home, shop, bag, favorites, profile), with nested folders like `shop/` and `profile/` containing stack navigators for related screens. Dynamic routes use bracket notation (e.g., `[category].tsx`).

#### `components/`

Reusable React components organized by feature. The `ui/` subfolder contains base UI components (Button, Typography, CustomInput) and SVG icons. The `category/` subfolder holds category-specific components (filters, sorting, display). Other components include layout wrappers (PageLayout, ThemedView), business logic components (ProductTile, BagItem, CategoryCard), and utility components (ErrorBoundary, SplashScreenController).

#### `redux/`

Redux Toolkit slices organized by domain. Each subfolder (auth, cart, categories, favorites) contains a slice file managing state, actions, and async thunks for that domain. The cart and favorites slices handle AsyncStorage persistence, while auth manages user sessions and tokens. Categories slice handles product and category data fetching.

#### `services/`

External service integrations and abstractions. The `store-api/` folder contains RTK Query API definitions for authentication and product/category endpoints. The `logger/` folder provides a logging abstraction layer that can integrate with third-party services like Sentry or Crashlytics while remaining decoupled from their implementations.

#### `utils/`

Pure utility functions for data transformation, storage, and formatting. Includes storage utilities (cart-storage, favorites-storage, secure-storage), data mapping functions (map-products, map-categories), and formatting helpers (format-category-name). These are stateless functions that can be easily tested and reused.

#### `hooks/`

Custom React hooks that encapsulate reusable logic. Includes theme hooks (use-themed-styles, use-theme-color, use-color-scheme), Redux hooks (use-redux-toolkit), session management (use-session), translation hooks (use-translation), and storage hooks (use-storage-state). These hooks abstract common patterns and provide consistent APIs across the app.

#### `constants/`

Application-wide constants and configuration. Contains theme definitions (colors, typography) and category constants. These values are used throughout the app for consistent styling and data references.

#### `locales/`

Internationalization translation files organized by language code (en, es, fr). Each language folder contains a JSON file with all translatable strings. The `fallback.json` provides default translations when a key is missing in the selected language.

#### `@types/`

TypeScript type definitions for the application. Contains interfaces and types for domain models (Product, Cart, User, Category), navigation types, and third-party library augmentations (react-i18next). This ensures type safety across the codebase.

#### `context/`

React Context providers for global state that doesn't fit Redux. Currently contains `session-context.tsx` which provides authentication state and session management through React Context API, complementing the Redux auth slice.

#### `assets/`

Static assets including fonts (Metropolis font family) and images (app icons, category images, splash screens). Organized into subfolders for better organization. These assets are bundled with the app.

#### `store/`

Redux store configuration. Contains the main store setup with middleware, reducers, and RTK Query API configuration. This is the central point where all Redux slices are combined and the store is exported.

#### `i18n/`

Internationalization configuration. Contains the i18next setup, language detection, and initialization logic. This module is imported early in the app lifecycle to ensure translations are available throughout the application.

#### `scripts/`

Build and utility scripts. Contains helper scripts for project maintenance, such as reset-project.js for cleaning up generated files.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
