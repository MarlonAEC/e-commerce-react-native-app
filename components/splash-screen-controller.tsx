import { useAppSelector } from "@/hooks/use-redux-toolkit";
import { logger } from "@/services/logger";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
/**
 * SplashScreenController manages the splash screen visibility
 * Keeps splash screen visible until authentication state is loaded
 */
export function SplashScreenController() {
  const { isLoading } = useAppSelector((state) => state.auth);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen once auth state is loaded
      // Use a small timeout to ensure the navigation is ready
      hideTimeoutRef.current = setTimeout(() => {
        SplashScreen.hideAsync()
          .then(() => {
            logger.info("Splash screen hidden successfully");
          })
          .catch((error) => {
            const err =
              error instanceof Error ? error : new Error(String(error));
            logger.error("Failed to hide splash screen", err);
          });
      }, 500); // Increased timeout to ensure everything is ready

      return () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }
  }, [isLoading]);

  // Don't render anything - just control splash screen visibility
  return null;
}
