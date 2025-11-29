import { StyleSheet, type StyleSheet as RNStyleSheet } from "react-native";

import { Colors } from "@/constants/theme";

type ThemeColors = typeof Colors.light & typeof Colors.dark;

/**
 * Utility function to create themed styles for a specific theme.
 * Use this when you need styles for a specific theme (e.g., in a non-component context).
 * For components, prefer `useThemedStyles` hook which reacts to theme changes.
 *
 * @param styleFactory - A function that receives theme colors and returns a style object
 * @param theme - Theme to use ('light' | 'dark'). Defaults to 'light'
 * @returns A StyleSheet with themed styles
 *
 * @example
 * const lightStyles = createThemedStyle((colors) => ({
 *   container: {
 *     backgroundColor: colors.background,
 *   },
 * }), 'light');
 *
 * @example
 * // In a non-component context
 * const styles = createThemedStyle((colors) => ({
 *   button: {
 *     backgroundColor: colors.tint,
 *     color: colors.text,
 *   },
 * }));
 */
export function createThemedStyle<T extends Record<string, any>>(
  styleFactory: (colors: ThemeColors) => T,
  theme: "light" | "dark" = "light"
): RNStyleSheet.NamedStyles<T> {
  const colors = Colors[theme];
  const styles = styleFactory(colors);
  return StyleSheet.create(styles);
}
