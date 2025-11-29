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
 * @returns An object containing both the StyleSheet and the colors object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { styles, colors } = useThemedStyles((colors) => ({
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
 *       <Text style={{ color: colors.tint }}>Tinted text</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemedStyles<T extends Record<string, Style>>(
  styleFactory: (colors: ThemeColors) => T
): { styles: T; colors: ThemeColors } {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const styles = useMemo(() => {
    const styleObject = styleFactory(colors);
    return StyleSheet.create(styleObject) as T;
  }, [styleFactory, colors]);

  return useMemo(
    () => ({
      styles,
      colors,
      colorScheme,
    }),
    [styles, colors, colorScheme]
  );
}
