import { useThemedStyles } from "@/hooks/use-themed-styles";
import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";
import { ErrorBoundary } from "./error-boundary";
import { ErrorFallback } from "./error-fallback";
import { ThemedView } from "./themed-view";

/**
 * Base props shared by all PageLayout variants
 */
type BasePageLayoutProps = {
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
   * Enable pull-to-refresh functionality
   * When provided, shows a refresh indicator when pulling down
   */
  refreshing?: boolean;
  /**
   * Callback function called when user pulls down to refresh
   */
  onRefresh?: () => void;
};

/**
 * PageLayout props when shouldShowSafeArea is true
 * Style prop must be compatible with SafeAreaView
 */
type PageLayoutWithSafeAreaProps = BasePageLayoutProps & {
  shouldShowSafeArea: true;
  style?: NativeSafeAreaViewProps["style"];
};

/**
 * PageLayout props when shouldShowSafeArea is false or undefined
 * Style prop must be compatible with View
 */
type PageLayoutWithoutSafeAreaProps = BasePageLayoutProps & {
  shouldShowSafeArea?: false;
  style?: StyleProp<ViewStyle>;
};

/**
 * Discriminated union type that conditionally types the style prop
 * based on the shouldShowSafeArea prop
 */
export type PageLayoutProps =
  | PageLayoutWithSafeAreaProps
  | PageLayoutWithoutSafeAreaProps;

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
  style,
  refreshing,
  onRefresh,
}: PageLayoutProps) {
  const { styles } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      // Add bottom padding to account for tab bar when shouldShowSafeArea is false
      // Tab bar height: iOS = 88, Android = 70, plus extra spacing
      paddingBottom:
        shouldShowSafeArea === false ? (Platform.OS === "ios" ? 100 : 80) : 0,
    },
    safeAreaView: {},
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
        <SafeAreaView edges={["top"]} style={[styles.safeAreaView, style]}>
          <ThemedView
            scrollable
            style={[styles.content, styles.contentContainer]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          >
            {children}
          </ThemedView>
        </SafeAreaView>
      )}
      {!shouldShowSafeArea && (
        <ThemedView scrollable={false} style={[styles.contentContainer, style]}>
          {children}
        </ThemedView>
      )}
    </ErrorBoundary>
  );
}
