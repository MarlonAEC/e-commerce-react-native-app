import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export type ButtonProps = PressableProps & {
  /**
   * Button text content
   */
  title: string;
  /**
   * Whether the button is in a loading state
   * When true, shows an ActivityIndicator instead of the title
   */
  loading?: boolean;
  /**
   * Custom button style
   */
  buttonStyle?: ViewStyle;
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  /**
   * Accessibility label for the button
   * If not provided, defaults to the title
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint describing what happens when the button is pressed
   */
  accessibilityHint?: string;
};

/**
 * Generic Button component that matches the login button style
 * Supports loading state, disabled state, and full accessibility
 *
 * @example
 * ```tsx
 * <Button
 *   title="LOGIN"
 *   onPress={handleLogin}
 *   loading={isLoading}
 *   disabled={!isValid}
 * />
 * ```
 */
export function Button({
  title,
  loading = false,
  disabled,
  buttonStyle,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...pressableProps
}: ButtonProps) {
  const { styles, colors } = useThemedStyles((colors) => ({
    button: {
      width: "100%",
      height: 50,
      backgroundColor: colors.tint,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,
    disabledButton: {
      opacity: 0.6,
    } as ViewStyle,
    buttonText: {
      color: colors.background,
      fontWeight: "600",
      textTransform: "uppercase",
      fontSize: 14,
    },
  }));

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[styles.button, isDisabled && styles.disabledButton, buttonStyle]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
      }}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          color={colors.background}
          accessibilityLabel={`${title} - Loading`}
        />
      ) : (
        <Typography
          variant="button"
          customColor={colors.background}
          style={[styles.buttonText, textStyle]}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

