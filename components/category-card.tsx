import { Image } from "expo-image";
import React from "react";
import { Pressable, View, type ViewStyle } from "react-native";

import { Category } from "@/@types/categories";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Typography } from "./ui/typography";

export type CategoryCardProps = {
  category: Category;
  /**
   * Optional callback when card is pressed
   * If both category.onPress and onPress are provided, category.onPress takes precedence
   */
  onPress?: () => void;
};

/**
 * CategoryCard component that displays an image with optional text overlay
 * Matches the design from the reference image with text floating on top of images
 */
export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { styles } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      margin: 0,
      borderRadius: 0,
      overflow: "hidden",
      backgroundColor: colors.background,
    } as ViewStyle,
    imageContainer: {
      width: "100%",
      height: "100%",
      position: "relative",
    } as ViewStyle,
    image: {
      width: "100%",
      height: "100%",
    },
    textOverlay: {
      position: "absolute",
      padding: 12,
      ...(category.textPosition === "bottom-right" && {
        bottom: 0,
        right: 0,
      }),
      ...(category.textPosition === "bottom-left" && {
        bottom: 0,
        left: 0,
      }),
      ...(category.textPosition === "center" && {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
      }),
    } as ViewStyle,
    textContainer: {
      // Add background if specified, otherwise transparent
      backgroundColor: category.textBackgroundColor || "transparent",
      paddingHorizontal: category.textBackgroundColor ? 8 : 0,
      paddingVertical: category.textBackgroundColor ? 4 : 0,
      borderRadius: category.textBackgroundColor ? 4 : 0,
    } as ViewStyle,
  }));

  const handlePress = () => {
    // Use category.onPress if provided, otherwise use prop onPress
    if (category.onPress) {
      category.onPress();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={category.image}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.textOverlay}>
          <View style={styles.textContainer}>
            <Typography
              variant="h3"
              customColor="#FFFFFF"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
                fontWeight: "700",
              }}
            >
              {category.title}
            </Typography>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
