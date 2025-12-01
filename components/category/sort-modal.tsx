import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import React from "react";
import { Modal, Pressable, View, type ViewStyle } from "react-native";
import { SortOption, getSortDisplayText } from "./filter-sort-bar";

export type SortModalProps = {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Current selected sort option
   */
  currentSort?: SortOption;
  /**
   * Callback when sort option is selected
   */
  onSelectSort: (sort: SortOption) => void;
  /**
   * Callback when modal should be closed
   */
  onClose: () => void;
};

const SORT_OPTIONS: SortOption[] = [
  "popular",
  "newest",
  "customer_review",
  "price_low_high",
  "price_high_low",
];

/**
 * Sort Modal component
 * Displays sort options in a bottom sheet style modal
 */
export function SortModal({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}: SortModalProps) {
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
      maxHeight: "80%",
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
    optionContainer: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    } as ViewStyle,
    optionText: {
      fontSize: 16,
      color: colors.text,
    },
    selectedOption: {
      backgroundColor: colors.tint,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    } as ViewStyle,
    selectedOptionText: {
      color: colors.background,
      fontWeight: "600",
    },
  }));

  const handleSelectSort = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

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
          <View style={styles.dragHandle} />
          <Typography variant="h4" style={styles.title}>
            Sort by
          </Typography>

          {SORT_OPTIONS.map((option) => {
            const isSelected = currentSort === option;
            const displayText = getSortDisplayText(option);

            return (
              <Pressable
                key={option}
                style={[
                  styles.optionContainer,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => handleSelectSort(option)}
                accessibilityRole="button"
                accessibilityLabel={displayText}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.optionButton}>
                  <Typography
                    variant="body"
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {displayText}
                  </Typography>
                </View>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

