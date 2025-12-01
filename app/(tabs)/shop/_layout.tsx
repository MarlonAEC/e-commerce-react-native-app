import { Stack } from "expo-router";

/**
 * Shop Stack Navigator
 * Handles navigation within the shop section:
 * - shop/index: Category list screen
 * - shop/[category]: Category detail screen
 */
export default function ShopLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[category]" />
    </Stack>
  );
}
