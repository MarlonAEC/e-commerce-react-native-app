import { Category } from "@/@types/categories";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View, type ViewStyle } from "react-native";
import { CategoryCard } from "./category-card";
import { ThemedView } from "./themed-view";

export default function MasonryCategoryList({
  categories,
}: {
  categories: Category[];
}) {
  const { styles } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    listContainer: {
      paddingHorizontal: 0,
    } as ViewStyle,
  }));

  const handleCategoryPress = (category: Category) => {
    console.log("Category pressed:", category.id);
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

  return (
    <ThemedView style={styles.container}>
      <FlashList<Category>
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item: Category) => item.id}
        numColumns={2}
        masonry
        contentContainerStyle={styles.listContainer}
        overrideItemLayout={(layout, item) => {
          layout.span = item.span;
        }}
      />
    </ThemedView>
  );
}
