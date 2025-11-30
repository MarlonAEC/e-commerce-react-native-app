import React from "react";
import { Platform, Text, type TextProps, type TextStyle } from "react-native";

import { Colors, Fonts, getMetropolisFont } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "bodyLarge"
  | "bodySmall"
  | "caption"
  | "overline"
  | "button"
  | "link";

export type TypographyWeight =
  | "normal"
  | "400"
  | "500"
  | "600"
  | "700"
  | "bold";

export type TypographyFontFamily = "sans" | "serif" | "rounded" | "mono";

export type TypographyProps = TextProps & {
  /**
   * Typography variant - determines default size, weight, and line height
   */
  variant?: TypographyVariant;
  /**
   * Font size in pixels (overrides variant default)
   */
  size?: number;
  /**
   * Font weight (overrides variant default)
   */
  weight?: TypographyWeight;
  /**
   * Font family from theme
   */
  fontFamily?: TypographyFontFamily;
  /**
   * Text color from theme colors
   */
  color?: keyof typeof Colors.light;
  /**
   * Custom text color (overrides theme color)
   */
  customColor?: string;
  /**
   * Line height multiplier (defaults based on variant)
   */
  lineHeight?: number;
  /**
   * Text alignment
   */
  align?: "left" | "center" | "right" | "justify";
  /**
   * Number of lines before truncating
   */
  numberOfLines?: number;
  /**
   * Whether text should be selectable
   */
  selectable?: boolean;
};

const variantStyles: Record<
  TypographyVariant,
  Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight"> & {
    textTransform?: TextStyle["textTransform"];
    letterSpacing?: number;
    textDecorationLine?: TextStyle["textDecorationLine"];
  }
> = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  link: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textDecorationLine: "underline" as const,
  },
};

/**
 * Typography component that renders text with theme-aware styling.
 * Supports various typography variants, sizes, weights, and colors.
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="body" color="text">Body text</Typography>
 * <Typography size={20} weight="600" fontFamily="sans">
 *   Custom styled text
 * </Typography>
 * ```
 */
export function Typography({
  variant = "body",
  size,
  weight,
  fontFamily = "sans",
  color = "text",
  customColor,
  lineHeight,
  align,
  numberOfLines,
  selectable = false,
  style,
  children,
  ...rest
}: TypographyProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const fonts = Fonts;

  const variantStyle = variantStyles[variant];
  const finalWeight = weight ?? variantStyle.fontWeight;

  // Use Metropolis font for sans family, otherwise use theme font
  const fontFamilyValue =
    fontFamily === "sans"
      ? getMetropolisFont(
          finalWeight as "normal" | "400" | "500" | "600" | "700" | "bold",
          false // TODO: Add italic support if needed
        )
      : fonts[fontFamily];

  const textColor = customColor ?? colors[color];

  const computedStyle: TextStyle = {
    fontFamily: fontFamilyValue,
    fontSize: size ?? variantStyle.fontSize,
    // On iOS/Android, we use the fontFamily to specify weight, so we set fontWeight to "normal"
    // On web, we can use fontWeight directly
    fontWeight: Platform.OS === "web" ? finalWeight : "normal",
    lineHeight: lineHeight ?? variantStyle.lineHeight,
    color: textColor,
    textAlign: align,
    ...(variant === "overline" && {
      textTransform: "uppercase",
      letterSpacing: 1.5,
    }),
    ...(variant === "link" && {
      textDecorationLine: "underline",
    }),
  };

  return (
    <Text
      style={[computedStyle, style]}
      numberOfLines={numberOfLines}
      selectable={selectable}
      {...rest}
    >
      {children}
    </Text>
  );
}
