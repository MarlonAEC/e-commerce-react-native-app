import { Stack } from "expo-router";

/**
 * Profile Stack Navigator
 * Handles navigation within the profile section:
 * - profile/index: Main profile screen
 * - profile/language: Language selection screen
 */
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Enable swipe back gesture
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
    </Stack>
  );
}

