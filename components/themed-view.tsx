import { ScrollView, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  scrollable?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  scrollable,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return scrollable ? (
    <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  ) : (
    <View style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
