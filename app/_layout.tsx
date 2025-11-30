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
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;

  // Load Metropolis fonts
  const [fontsLoaded, fontError] = useFonts({
    "Metropolis-Thin": require("@/assets/fonts/metropolis/Metropolis-Thin.otf"),
    "Metropolis-ThinItalic": require("@/assets/fonts/metropolis/Metropolis-ThinItalic.otf"),
    "Metropolis-ExtraLight": require("@/assets/fonts/metropolis/Metropolis-ExtraLight.otf"),
    "Metropolis-ExtraLightItalic": require("@/assets/fonts/metropolis/Metropolis-ExtraLightItalic.otf"),
    "Metropolis-Light": require("@/assets/fonts/metropolis/Metropolis-Light.otf"),
    "Metropolis-LightItalic": require("@/assets/fonts/metropolis/Metropolis-LightItalic.otf"),
    "Metropolis-Regular": require("@/assets/fonts/metropolis/Metropolis-Regular.otf"),
    "Metropolis-RegularItalic": require("@/assets/fonts/metropolis/Metropolis-RegularItalic.otf"),
    "Metropolis-Medium": require("@/assets/fonts/metropolis/Metropolis-Medium.otf"),
    "Metropolis-MediumItalic": require("@/assets/fonts/metropolis/Metropolis-MediumItalic.otf"),
    "Metropolis-SemiBold": require("@/assets/fonts/metropolis/Metropolis-SemiBold.otf"),
    "Metropolis-SemiBoldItalic": require("@/assets/fonts/metropolis/Metropolis-SemiBoldItalic.otf"),
    "Metropolis-Bold": require("@/assets/fonts/metropolis/Metropolis-Bold.otf"),
    "Metropolis-BoldItalic": require("@/assets/fonts/metropolis/Metropolis-BoldItalic.otf"),
    "Metropolis-ExtraBold": require("@/assets/fonts/metropolis/Metropolis-ExtraBold.otf"),
    "Metropolis-ExtraBoldItalic": require("@/assets/fonts/metropolis/Metropolis-ExtraBoldItalic.otf"),
    "Metropolis-Black": require("@/assets/fonts/metropolis/Metropolis-Black.otf"),
    "Metropolis-BlackItalic": require("@/assets/fonts/metropolis/Metropolis-BlackItalic.otf"),
  });

  // Don't render until fonts are loaded
  // The SplashScreenController will handle hiding the splash screen after auth loads
  if (!fontsLoaded && !fontError) {
    return null;
  }

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
