import { Image, ImageSource } from "expo-image";
import React from "react";
import {
  Pressable,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import { FavoriteHeartIcon } from "./ui/svg-icons/favorite-heart-icon";
import { StarIcon } from "./ui/svg-icons/star-icon";
import { Typography } from "./ui/typography";

export type ProductTileProps = {
  /**
   * Product image source
   */
  image: ImageSource;
  /**
   * Discount percentage (e.g., 20 for 20% off)
   * If provided, shows discount badge
   */
  discountPercentage?: number;
  /**
   * Product rating (0-5)
   */
  rating?: number;
  /**
   * Number of reviews
   */
  reviewCount?: number;
  /**
   * Brand name
   */
  brand?: string;
  /**
   * Product title/name
   */
  title: string;
  /**
   * Original price (before discount)
   */
  originalPrice: number;
  /**
   * Current/discounted price
   */
  price: number;
  /**
   * Whether the product is in favorites/wishlist
   */
  isFavorite?: boolean;
  /**
   * Callback when product is pressed
   */
  onPress?: () => void;
  /**
   * Callback when favorite button is pressed
   */
  onFavoritePress?: () => void;
  /**
   * Callback when add to cart button is pressed
   */
  onAddToCartPress?: () => void;
  /**
   * Accessibility label for the product tile
   */
  accessibilityLabel?: string;
};

/**
 * ProductTile component that displays a product card with image, discount badge,
 * rating, brand, title, pricing, and favorite button.
 */
export default function ProductTile({
  image,
  discountPercentage,
  rating = 0,
  reviewCount = 0,
  brand,
  title,
  originalPrice,
  price,
  isFavorite = false,
  onPress,
  onFavoritePress,
  onAddToCartPress,
  accessibilityLabel,
}: ProductTileProps) {
  const { t } = useTranslation();
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      width: "100%",
      height: 390, // Fixed height to ensure consistent tile sizes
      backgroundColor: colors.background,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 16,
      flexDirection: "column",
    } as ViewStyle,
    imageContainer: {
      width: "100%",
      height: 200, // Fixed height for image to leave room for content
      position: "relative",
      backgroundColor: colors.background,
    } as ViewStyle,
    image: {
      width: "100%",
      height: "100%",
    },
    discountBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: colors.tint,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
      zIndex: 1,
    } as ViewStyle,
    discountText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: "600",
    },
    addToCartButton: {
      marginTop: 0,
      paddingVertical: 8,
      width: "100%",
      backgroundColor: colors.tint, // Red color
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    addToCartButtonText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: "600",
    },
    favoriteButton: {
      position: "absolute",
      bottom: -14,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
      // Shadow for button
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    contentContainer: {
      flex: 1,
      padding: 10,
      justifyContent: "flex-start",
      width: "100%",
    } as ViewStyle,
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    } as ViewStyle,
    starsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 4,
      gap: 2,
    } as ViewStyle,
    reviewCountText: {
      fontSize: 12,
      color: colors.tabIconDefault,
    },
    brandText: {
      fontSize: 12,
      color: colors.tabIconDefault,
      marginBottom: 2,
    },
    titleText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
      minHeight: 50, // Reserve space for 2 lines of text
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
      width: "100%",
    } as ViewStyle,
    originalPriceText: {
      fontSize: 14,
      color: colors.tabIconDefault,
      textDecorationLine: "line-through",
    },
    priceText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.tint,
    },
  }));

  const hasDiscount =
    discountPercentage !== undefined && discountPercentage > 0;
  const showOriginalPrice = hasDiscount && originalPrice !== price;

  // Render star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} fill={colors.starFilled} size={14} />);
      } else if (i === fullStars && hasHalfStar) {
        // For half star, just show empty for now
        stars.push(<StarIcon key={i} fill={colors.starDisabled} size={14} />);
      } else {
        stars.push(<StarIcon key={i} fill={colors.starDisabled} size={14} />);
      }
    }
    return stars;
  };

  const defaultAccessibilityLabel =
    accessibilityLabel ||
    `${title}${brand ? t("shop.product.byBrand", { brand }) : ""}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={
        onPress ? t("shop.product.viewDetailsHint") : undefined
      }
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} contentFit="cover" />

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Typography
              variant="caption"
              customColor={colors.background}
              weight="600"
              style={styles.discountText}
            >
              -{discountPercentage}%
            </Typography>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress?.();
          }}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite
              ? t("shop.product.removeFromFavorites")
              : t("shop.product.addToFavorites")
          }
          accessibilityHint={t("shop.product.toggleFavoriteHint")}
        >
          <FavoriteHeartIcon
            fill={isFavorite ? colors.tint : colors.disabled}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.contentContainer}>
        {/* Rating */}
        {(rating > 0 || reviewCount > 0) && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars()}</View>
            {reviewCount > 0 && (
              <Typography variant="caption" style={styles.reviewCountText}>
                ({reviewCount})
              </Typography>
            )}
          </View>
        )}

        {/* Brand */}
        {brand && (
          <Typography variant="caption" style={styles.brandText}>
            {brand}
          </Typography>
        )}

        {/* Title */}
        <Typography
          variant="body"
          weight="700"
          style={styles.titleText}
          numberOfLines={2}
        >
          {title}
        </Typography>

        {/* Price */}
        <View style={styles.priceContainer}>
          {showOriginalPrice && (
            <Typography variant="bodySmall" style={styles.originalPriceText}>
              ${originalPrice.toFixed(2)}
            </Typography>
          )}
          <Typography variant="body" weight="600" style={styles.priceText}>
            ${price.toFixed(2)}
          </Typography>
        </View>

        {/* Add to Cart Button */}
        {onAddToCartPress && (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCartPress();
            }}
            accessibilityRole="button"
            accessibilityLabel={t("shop.product.addToCart")}
            accessibilityHint={t("shop.product.addToCartHint")}
          >
            <Typography variant="caption" style={styles.addToCartButtonText}>
              {t("shop.product.addToCart")}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}
