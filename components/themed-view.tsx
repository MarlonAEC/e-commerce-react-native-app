import {
  RefreshControl,
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = (ViewProps | ScrollViewProps) & {
  lightColor?: string;
  darkColor?: string;
  scrollable?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  /**
   * Enable pull-to-refresh functionality
   * When provided, shows a refresh indicator when pulling down
   */
  refreshing?: boolean;
  /**
   * Callback function called when user pulls down to refresh
   */
  onRefresh?: () => void;
  /**
   * Color of the refresh indicator
   * If not provided, uses the theme tint color
   */
  refreshControlTintColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  scrollable,
  contentContainerStyle,
  refreshing,
  onRefresh,
  refreshControlTintColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const tintColor = useThemeColor({}, "tint");

  return scrollable ? (
    <ScrollView
      style={[{ backgroundColor }, style]}
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            tintColor={refreshControlTintColor ?? tintColor}
          />
        ) : undefined
      }
      {...otherProps}
    />
  ) : (
    <View style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
