import { Category } from "@/@types/categories";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { logger } from "@/services/logger";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { RefreshControl, View, type ViewStyle } from "react-native";
import { CategoryCard } from "./category-card";
import { ThemedView } from "./themed-view";

export default function MasonryCategoryList({
  categories,
  refreshing,
  onRefresh,
  onCategoryPress,
}: {
  categories: Category[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onCategoryPress?: (category: Category) => void;
}) {
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    listContainer: {
      paddingHorizontal: 0,
    } as ViewStyle,
  }));

  const handleCategoryPress = (category: Category) => {
    logger.debug("Category pressed", { categoryId: category.id });
    if (onCategoryPress) {
      onCategoryPress(category);
    }
  };

  const renderItem = ({ item }: { item: Category }) => {
    // Use custom height if provided, otherwise use default based on span
    const height = item.height ?? (item.span === 2 ? 300 : 200);

    return (
      <View style={{ height }}>
        <CategoryCard
          category={item}
          onPress={() => handleCategoryPress(item)}
        />
      </View>
    );
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Create RefreshControl with proper iOS and Android support
  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing ?? false}
      onRefresh={handleRefresh}
      tintColor={colors.tint} // iOS
      colors={[colors.tint]} // Android
      progressBackgroundColor={colors.background} // Android
    />
  ) : undefined;

  return (
    <ThemedView style={styles.container} scrollable={false}>
      <FlashList<Category>
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item: Category) => item.id.toString()}
        numColumns={2}
        masonry
        optimizeItemArrangement
        contentContainerStyle={styles.listContainer}
        refreshControl={refreshControl}
        overrideItemLayout={(layout, item) => {
          layout.span = item.span;
        }}
      />
    </ThemedView>
  );
}
