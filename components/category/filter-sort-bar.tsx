import { FilterIcon } from "@/components/ui/svg-icons/filter-icon";
import { SortIcon } from "@/components/ui/svg-icons/sort-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
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
 */
export function getSortDisplayText(sort: SortOption): string {
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

  const sortText = currentSort ? getSortDisplayText(currentSort) : "Sort";

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={onFilterPress}
        accessibilityRole="button"
        accessibilityLabel="Filters"
        accessibilityHint="Open filters to refine products"
      >
        <FilterIcon fill={colors.text} />
        <Typography variant="bodySmall" style={styles.buttonText}>
          Filters
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
        accessibilityLabel={`Sort: ${sortText}`}
        accessibilityHint="Open sort options"
      >
        <SortIcon fill={colors.text} />
        <Typography variant="bodySmall" style={styles.buttonText}>
          {sortText}
        </Typography>
      </Pressable>
    </View>
  );
}
