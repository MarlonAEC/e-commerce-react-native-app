import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Animated, View, type ViewProps } from "react-native";

// Create an animated View component
const AnimatedView = Animated.createAnimatedComponent(View);

// Type for animated style values
type AnimatedStyle = Animated.AnimatedProps<ViewProps>["style"];

export type AnimatedThemedViewProps = Omit<ViewProps, "style"> & {
  style?: AnimatedStyle;
  lightColor?: string;
  darkColor?: string;
};

/**
 * AnimatedThemedView - An animated View component that adapts to theme
 * Combines Animated.View with theme color support
 */
export function AnimatedThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: AnimatedThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <AnimatedView style={[{ backgroundColor }, style]} {...otherProps} />;
}
