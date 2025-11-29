import { useThemedStyles } from "@/hooks/use-themed-styles";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Typography } from "./ui/typography";

/**
 * Component that throws an error during render when triggered
 * This is useful for testing ErrorBoundary components
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <ErrorTestButton />
 * </ErrorBoundary>
 * ```
 */
export function ErrorTestButton() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const { styles, colors } = useThemedStyles((colors) => ({
    button: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: colors.tint,
      borderRadius: 8,
      alignSelf: "center",
    },
  }));

  // This will trigger the error boundary when shouldThrow is true
  if (shouldThrow) {
    throw new Error(
      "Test error: This is a test error to verify ErrorBoundary is working!"
    );
  }

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        // Note: Errors in event handlers won't be caught by ErrorBoundary
        // So we set state which will cause a re-render, and the error is thrown during render
        setShouldThrow(true);
      }}
    >
      <Typography variant="button" customColor={colors.background}>
        Trigger Error (Test ErrorBoundary)
      </Typography>
    </Pressable>
  );
}
