import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, View, type ViewStyle } from "react-native";

export type FilterOptions = {
  priceRange?: {
    min: number;
    max: number;
  };
  colors?: string[];
  sizes?: string[];
  category?: string;
  brands?: string[];
};

export type FilterModalProps = {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Current filter options
   */
  filters: FilterOptions;
  /**
   * Callback when filters are applied
   */
  onApplyFilters: (filters: FilterOptions) => void;
  /**
   * Callback when modal should be closed
   */
  onClose: () => void;
  /**
   * Callback when filters are discarded
   */
  onDiscard: () => void;
};

// Available options
const COLORS = ["Black", "White", "Red", "Brown", "Beige", "Blue"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const CATEGORIES = ["All", "Women", "Men", "Boys", "Girls"];

/**
 * Filter Modal component
 * Displays filter options in a bottom sheet style modal
 */
export function FilterModal({
  visible,
  filters,
  onApplyFilters,
  onClose,
  onDiscard,
}: FilterModalProps) {
  const { styles, colors } = useThemedStyles((colors) => ({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    } as ViewStyle,
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingBottom: 32,
      paddingHorizontal: 16,
      maxHeight: "90%",
    } as ViewStyle,
    dragHandle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 24,
    } as ViewStyle,
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    } as ViewStyle,
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    priceRangeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    } as ViewStyle,
    priceText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
    },
    colorContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    } as ViewStyle,
    colorSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
    } as ViewStyle,
    colorSwatchSelected: {
      borderColor: colors.tint,
      borderWidth: 3,
    } as ViewStyle,
    sizeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    } as ViewStyle,
    sizeButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    } as ViewStyle,
    sizeButtonSelected: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    } as ViewStyle,
    sizeButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    sizeButtonTextSelected: {
      color: colors.background,
    },
    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    } as ViewStyle,
    footer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    } as ViewStyle,
    footerButton: {
      flex: 1,
    } as ViewStyle,
  }));

  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleDiscard = () => {
    setLocalFilters({});
    onDiscard();
    onClose();
  };

  const toggleColor = (color: string) => {
    const currentColors = localFilters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    setLocalFilters({ ...localFilters, colors: newColors });
  };

  const toggleSize = (size: string) => {
    const currentSizes = localFilters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setLocalFilters({ ...localFilters, sizes: newSizes });
  };

  const selectCategory = (category: string) => {
    setLocalFilters({ ...localFilters, category });
  };

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      Black: "#000000",
      White: "#FFFFFF",
      Red: "#FF0000",
      Brown: "#8B4513",
      Beige: "#F5F5DC",
      Blue: "#0000FF",
    };
    return colorMap[color] || "#CCCCCC";
  };

  const activeFilterCount =
    (localFilters.colors?.length || 0) +
    (localFilters.sizes?.length || 0) +
    (localFilters.category ? 1 : 0) +
    (localFilters.brands?.length || 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dragHandle} />
            <Typography variant="h4" style={styles.title}>
              Filters
            </Typography>

            {/* Price Range */}
            <View style={styles.section}>
              <Typography variant="body" weight="600" style={styles.sectionTitle}>
                Price range
              </Typography>
              <View style={styles.priceRangeContainer}>
                <Typography variant="bodySmall" style={styles.priceText}>
                  ${localFilters.priceRange?.min || 0}
                </Typography>
                <Typography variant="bodySmall" style={styles.priceText}>
                  ${localFilters.priceRange?.max || 200}
                </Typography>
              </View>
              {/* TODO: Add slider component for price range */}
            </View>

            {/* Colors */}
            <View style={styles.section}>
              <Typography variant="body" weight="600" style={styles.sectionTitle}>
                Colors
              </Typography>
              <View style={styles.colorContainer}>
                {COLORS.map((color) => {
                  const isSelected = localFilters.colors?.includes(color);
                  return (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: getColorStyle(color) },
                        isSelected && styles.colorSwatchSelected,
                      ]}
                      onPress={() => toggleColor(color)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${color} color`}
                      accessibilityState={{ selected: isSelected }}
                    />
                  );
                })}
              </View>
            </View>

            {/* Sizes */}
            <View style={styles.section}>
              <Typography variant="body" weight="600" style={styles.sectionTitle}>
                Sizes
              </Typography>
              <View style={styles.sizeContainer}>
                {SIZES.map((size) => {
                  const isSelected = localFilters.sizes?.includes(size);
                  return (
                    <Pressable
                      key={size}
                      style={[
                        styles.sizeButton,
                        isSelected && styles.sizeButtonSelected,
                      ]}
                      onPress={() => toggleSize(size)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select size ${size}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Typography
                        variant="bodySmall"
                        style={[
                          styles.sizeButtonText,
                          isSelected && styles.sizeButtonTextSelected,
                        ]}
                      >
                        {size}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Typography variant="body" weight="600" style={styles.sectionTitle}>
                Category
              </Typography>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((category) => {
                  const isSelected = localFilters.category === category;
                  return (
                    <Pressable
                      key={category}
                      style={[
                        styles.sizeButton,
                        isSelected && styles.sizeButtonSelected,
                      ]}
                      onPress={() => selectCategory(category)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select category ${category}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Typography
                        variant="bodySmall"
                        style={[
                          styles.sizeButtonText,
                          isSelected && styles.sizeButtonTextSelected,
                        ]}
                      >
                        {category}
                      </Typography>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.footerButton,
                  {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 30,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={handleDiscard}
                accessibilityRole="button"
                accessibilityLabel="Discard filters"
              >
                <Typography variant="button" customColor={colors.text}>
                  Discard
                </Typography>
              </Pressable>
              <View style={styles.footerButton}>
                <Button
                  title="Apply"
                  onPress={handleApply}
                  accessibilityLabel={`Apply ${activeFilterCount} filters`}
                />
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

