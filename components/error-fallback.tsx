import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";

import { useThemedStyles } from "@/hooks/use-themed-styles";
import { ThemedView } from "./themed-view";
import { Typography } from "./ui/typography";

export type ErrorFallbackProps = {
  /**
   * The error that occurred
   */
  error: Error;
  /**
   * Function to reset the error and try again
   */
  onReset: () => void;
};

/**
 * Default error fallback UI component
 * Displays a user-friendly error message with a "Try Again" button
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={(error, resetError) => (
 *   <ErrorFallback error={error} onReset={resetError} />
 * )}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    } as ViewStyle,
    errorContainer: {
      alignItems: "center",
      maxWidth: 400,
    } as ViewStyle,
    button: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.tint,
      borderRadius: 8,
    } as ViewStyle,
    buttonText: {
      color: colors.background,
      fontWeight: "600",
    },
  }));

  return (
    <ThemedView style={styles.container}>
      <View style={styles.errorContainer}>
        <Typography
          variant="h3"
          color="text"
          align="center"
          style={{ marginBottom: 16 }}
        >
          Oops! Something went wrong
        </Typography>
        <Typography
          variant="body"
          color="text"
          align="center"
          style={{ marginBottom: 8 }}
        >
          {error.message || "An unexpected error occurred"}
        </Typography>
        <Typography
          variant="caption"
          color="text"
          align="center"
          style={{ opacity: 0.7 }}
        >
          Please try again or contact support if the problem persists.
        </Typography>
        <Pressable style={styles.button} onPress={onReset}>
          <Typography variant="button" customColor={colors.background}>
            Try Again
          </Typography>
        </Pressable>
      </View>
    </ThemedView>
  );
}
