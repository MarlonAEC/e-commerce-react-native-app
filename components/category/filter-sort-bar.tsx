import { FilterIcon } from "@/components/ui/svg-icons/filter-icon";
import { SortIcon } from "@/components/ui/svg-icons/sort-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import React from "react";
import { Platform, Pressable, View, type ViewStyle } from "react-native";

export type SortOption =
  | "popular"
  | "newest"
  | "customer_review"
  | "price_low_high"
  | "price_high_low";

export type FilterSortBarProps = {
  /**
   * Current sort option
   */
  currentSort?: SortOption;
  /**
   * Callback when filter button is pressed
   */
  onFilterPress: () => void;
  /**
   * Callback when sort button is pressed
   */
  onSortPress: () => void;
  /**
   * Number of active filters (optional, for showing badge)
   */
  activeFilterCount?: number;
};

/**
 * Get display text for sort option
 * Note: This function should be used with useTranslation hook in components
 * For now, keeping it for backward compatibility but it should use translations
 */
export function getSortDisplayText(sort: SortOption, t?: (key: string) => string): string {
  if (!t) {
    // Fallback for when translation is not available
    switch (sort) {
      case "popular":
        return "Popular";
      case "newest":
        return "Newest";
      case "customer_review":
        return "Customer review";
      case "price_low_high":
        return "Price: lowest to high";
      case "price_high_low":
        return "Price: highest to low";
      default:
        return "Sort";
    }
  }
  
  switch (sort) {
    case "popular":
      return t("shop.sort.popular");
    case "newest":
      return t("shop.sort.newest");
    case "customer_review":
      return t("shop.sort.customerReview");
    case "price_low_high":
      return t("shop.sort.priceLowHigh");
    case "price_high_low":
      return t("shop.sort.priceHighLow");
    default:
      return t("shop.sort.title");
  }
}

/**
 * Filter and Sort bar component
 * Displays filter and sort buttons with icons
 */
export function FilterSortBar({
  currentSort,
  onFilterPress,
  onSortPress,
  activeFilterCount = 0,
}: FilterSortBarProps) {
  const { t } = useTranslation();
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      // Shadow for bottom of filter/sort bar
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        : {
            elevation: 4,
          }),
    } as ViewStyle,
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    } as ViewStyle,
    buttonText: {
      fontSize: 14,
      color: colors.text,
    },
    filterBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: colors.tint,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    } as ViewStyle,
    badgeText: {
      color: colors.background,
      fontSize: 10,
      fontWeight: "600",
    },
  }));

  const sortText = currentSort
    ? getSortDisplayText(currentSort, t)
    : t("shop.sort.title");

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel={t("shop.filters.title")}
        accessibilityHint={t("shop.filters.openFilters")}
      >
        <FilterIcon fill={colors.text} />
        <Typography variant="bodySmall" style={styles.buttonText}>
          {t("shop.filters.title")}
        </Typography>
        {activeFilterCount > 0 && (
          <View style={styles.filterBadge}>
            <Typography variant="caption" style={styles.badgeText}>
              {activeFilterCount}
            </Typography>
          </View>
        )}
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onSortPress}
        accessibilityRole="button"
        accessibilityLabel={`${t("shop.sort.title")}: ${sortText}`}
        accessibilityHint={t("shop.sort.openSort")}
      >
        <SortIcon fill={colors.text} />
        <Typography variant="bodySmall" style={styles.buttonText}>
          {sortText}
        </Typography>
      </Pressable>
    </View>
  );
}
