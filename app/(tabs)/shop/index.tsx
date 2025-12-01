import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import { useGetCategoryListQuery } from "@/services/store-api/categories";
import { formatCategoryName } from "@/utils/format-category-name";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  View,
  type ViewStyle,
} from "react-native";

export default function ShopScreen() {
  const { t } = useTranslation();
  const { data: categories, isLoading, error } = useGetCategoryListQuery();

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
    title: {
      marginBottom: 24,
    },
    viewAllButton: {
      marginBottom: 24,
    } as ViewStyle,
    chooseCategoryLabel: {
      marginBottom: 16,
      color: colors.tabIconDefault,
    },
    categoryList: {
      flex: 1,
    } as ViewStyle,
    listContentContainer: {
      paddingBottom: Platform.OS === "ios" ? 100 : 90, // Account for tab bar
    } as ViewStyle,
    categoryItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    categoryText: {
      fontSize: 16,
      color: colors.text,
    },
  }));

  const handleViewAllItems = () => {
    // Navigate to a view-all page or show all products
    router.push("/(tabs)/shop/all");
  };

  const handleCategoryPress = (categoryName: string) => {
    // Convert category name to slug for URL (e.g., "Tops" -> "tops")
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/(tabs)/shop/${categorySlug}`);
  };

  const renderCategoryItem = ({ item }: { item: string }) => {
    // Format category name for display (handles both slugs and already-formatted names)
    const displayName = formatCategoryName(item);

    return (
      <Pressable
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item)}
        accessibilityRole="button"
        accessibilityLabel={t("shop.viewCategory", { category: displayName })}
        accessibilityHint={t("shop.viewCategoryHint", {
          category: displayName,
        })}
      >
        <Typography variant="body" style={styles.categoryText}>
          {displayName}
        </Typography>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <PageLayout shouldShowSafeArea={true}>
        <ThemedView style={styles.container} scrollable={false}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.tint} />
            <Typography variant="body" color="text" style={{ marginTop: 16 }}>
              {t("shop.loadingCategories")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout shouldShowSafeArea={true}>
        <ThemedView style={styles.container} scrollable={false}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Typography variant="body" color="text">
              {t("shop.errorLoadingCategories")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  return (
    <PageLayout shouldShowSafeArea={true} scrollable={false}>
      <ThemedView style={styles.container} scrollable={false}>
        <Typography variant="h1" style={styles.title}>
          {t("shop.categories")}
        </Typography>

        <View style={styles.viewAllButton}>
          <Button
            title={t("shop.viewAllItems")}
            onPress={handleViewAllItems}
            accessibilityLabel={t("shop.viewAllItems")}
            accessibilityHint={t("shop.viewAllItemsHint")}
          />
        </View>

        <Typography variant="bodySmall" style={styles.chooseCategoryLabel}>
          {t("shop.chooseCategory")}
        </Typography>

        <FlatList
          data={categories || []}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          style={styles.categoryList}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </PageLayout>
  );
}
