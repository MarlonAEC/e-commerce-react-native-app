import { SplashScreenController } from "@/components/splash-screen-controller";
import { Colors } from "@/constants/theme";
import { SessionProvider, useSession } from "@/context/session-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/i18n";
import { store } from "@/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <SessionProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            backgroundColor={backgroundColor}
            translucent={false}
          />
        </SessionProvider>
      </Provider>
    </ThemeProvider>
  );
}

/**
 * RootNavigator component that can access the Redux store
 * Uses Stack.Protected to protect routes based on authentication status
 */
function RootNavigator() {
  const { session, isLoading } = useSession();

  // Don't render navigator until session is loaded
  if (isLoading) {
    return null;
  }

  // Define both routes - Stack.Protected will handle access control
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
