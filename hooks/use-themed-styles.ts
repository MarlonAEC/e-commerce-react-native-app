import { useMemo } from "react";
import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeColors = typeof Colors.light & typeof Colors.dark;
type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Hook to create themed styles that automatically update when theme changes.
 *
 * @param styleFactory - A function that receives theme colors and returns a style object
 * @returns A StyleSheet with themed styles
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const styles = useThemedStyles((colors) => ({
 *     container: {
 *       flex: 1,
 *       backgroundColor: colors.background,
 *       padding: 16,
 *     },
 *     title: {
 *       color: colors.text,
 *       fontSize: 24,
 *       fontWeight: "bold",
 *     },
 *     button: {
 *       backgroundColor: colors.tint,
 *       padding: 12,
 *       borderRadius: 8,
 *     },
 *   }));
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.title}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemedStyles<T extends Record<string, Style>>(
  styleFactory: (colors: ThemeColors) => T
): T {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return useMemo(() => {
    const styles = styleFactory(colors);
    return StyleSheet.create(styles) as T;
  }, [styleFactory, colors]);
}
