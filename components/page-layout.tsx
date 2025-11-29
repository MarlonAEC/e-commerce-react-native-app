import { useThemedStyles } from "@/hooks/use-themed-styles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundary } from "./error-boundary";
import { ErrorFallback } from "./error-fallback";
import { ThemedView } from "./themed-view";

export type PageLayoutProps = {
  children: React.ReactNode;
  /**
   * Custom error fallback component
   * If not provided, uses the default error UI
   */
  errorFallback?: (error: Error, resetError: () => void) => React.ReactNode;
  /**
   * Custom reset handler that will be called when user tries to recover from error
   * This allows each page to implement its own recovery strategy (e.g., navigate away, reset state, etc.)
   *
   * @param resetError - The default reset function from ErrorBoundary (resets error state)
   * @param error - The error that occurred
   */
  onResetError?: (resetError: () => void, error: Error) => void;
  /**
   * Whether to show the safe area view
   * @default true
   */
  shouldShowSafeArea?: boolean;
};

/**
 * PageLayout component that wraps content with an ErrorBoundary
 * to catch and handle rendering errors gracefully.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 * @see https://docs.expo.dev/router/error-handling/
 *
 * @example
 * ```tsx
 * <PageLayout>
 *   <YourContent />
 * </PageLayout>
 * ```
 */
export default function PageLayout({
  children,
  errorFallback,
  onResetError,
  shouldShowSafeArea = true,
}: PageLayoutProps) {
  const { styles } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      marginBottom: 100,
      backgroundColor: colors.background,
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: colors.background,
    },
  }));
  // Create a wrapper fallback that uses custom reset handler if provided
  const customFallback = React.useMemo(() => {
    if (!errorFallback && !onResetError) {
      return undefined; // Use default ErrorFallback from ErrorBoundary
    }

    const fallbackComponent = (error: Error, resetError: () => void) => {
      // Create wrapped reset function that calls custom handler if provided
      const wrappedResetError = () => {
        if (onResetError) {
          onResetError(resetError, error);
        } else {
          resetError();
        }
      };

      // If custom fallback is provided, use it with wrapped reset
      if (errorFallback) {
        return errorFallback(error, wrappedResetError);
      }

      // Otherwise use default ErrorFallback with custom reset handler
      return <ErrorFallback error={error} onReset={wrappedResetError} />;
    };

    // Set display name for React DevTools
    fallbackComponent.displayName = "PageLayoutErrorFallback";

    return fallbackComponent;
  }, [errorFallback, onResetError]);

  return (
    <ErrorBoundary fallback={customFallback}>
      {shouldShowSafeArea && (
        <SafeAreaView edges={["top"]} style={styles.safeAreaView}>
          <ThemedView scrollable style={styles.content}>
            {children}
          </ThemedView>
        </SafeAreaView>
      )}
      {!shouldShowSafeArea && (
        <ThemedView scrollable style={styles.content}>
          {children}
        </ThemedView>
      )}
    </ErrorBoundary>
  );
}
