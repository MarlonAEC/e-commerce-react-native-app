/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#DB3022";
const tintColorDark = "#DB3022";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    border: "#E5E5E5",
    icon: "#DB3022",
    starDisabled: "#E5E5E5",
    starFilled: "#FFBA49",
    tabIconDefault: "#9B9B9B", // Gray for inactive tabs
    tabIconSelected: tintColorLight, // Red for active tab
    disabled: "#9B9B9B",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    starDisabled: "#E5E5E5",
    starFilled: "#FFBA49",
    border: "#2A2A2A",
    icon: "#DB3022",
    tabIconDefault: "#9BA1A6", // Gray for inactive tabs
    tabIconSelected: tintColorDark, // White for active tab
    disabled: "#9B9B9B",
  },
};

/**
 * Metropolis font family mapping
 * Maps font weights to the appropriate Metropolis font file
 */
export const MetropolisFonts = {
  thin: "Metropolis-Thin",
  thinItalic: "Metropolis-ThinItalic",
  extraLight: "Metropolis-ExtraLight",
  extraLightItalic: "Metropolis-ExtraLightItalic",
  light: "Metropolis-Light",
  lightItalic: "Metropolis-LightItalic",
  regular: "Metropolis-Regular",
  regularItalic: "Metropolis-RegularItalic",
  medium: "Metropolis-Medium",
  mediumItalic: "Metropolis-MediumItalic",
  semiBold: "Metropolis-SemiBold",
  semiBoldItalic: "Metropolis-SemiBoldItalic",
  bold: "Metropolis-Bold",
  boldItalic: "Metropolis-BoldItalic",
  extraBold: "Metropolis-ExtraBold",
  extraBoldItalic: "Metropolis-ExtraBoldItalic",
  black: "Metropolis-Black",
  blackItalic: "Metropolis-BlackItalic",
} as const;

/**
 * Get Metropolis font name based on weight
 * @param weight - Font weight (normal, 400, 500, 600, 700, bold)
 * @param italic - Whether to use italic variant
 * @returns Font family name
 */
export function getMetropolisFont(
  weight: "normal" | "400" | "500" | "600" | "700" | "bold" = "normal",
  italic = false
): string {
  const weightMap: Record<string, keyof typeof MetropolisFonts> = {
    normal: "regular",
    "400": "regular",
    "500": "medium",
    "600": "semiBold",
    "700": "bold",
    bold: "bold",
  };

  const baseWeight = weightMap[weight] || "regular";
  const fontKey = italic
    ? (`${baseWeight}Italic` as keyof typeof MetropolisFonts)
    : baseWeight;

  return MetropolisFonts[fontKey];
}

export const Fonts = Platform.select({
  ios: {
    /** Metropolis font family - default sans-serif */
    sans: MetropolisFonts.regular,
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    /** Metropolis font family - default sans-serif */
    sans: MetropolisFonts.regular,
    serif: "serif",
    rounded: MetropolisFonts.regular,
    mono: "monospace",
  },
  web: {
    /** Metropolis font family with fallbacks */
    sans: `'Metropolis', 'Metropolis-Regular', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    serif: "Georgia, 'Times New Roman', serif",
    rounded: `'Metropolis', 'Metropolis-Regular', system-ui, sans-serif`,
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
