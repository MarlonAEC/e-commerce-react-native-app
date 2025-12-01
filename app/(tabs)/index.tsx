import { Category } from "@/@types/categories";
import { TabScreenProps } from "@/@types/navigation";
import MasonryCategoryList from "@/components/masonry-category-list";
import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useGetCategoriesQuery } from "@/services/store-api/categories";
import { mapCategoriesFromApi } from "@/utils/map-categories";
import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator } from "react-native";

type HomeScreenProps = TabScreenProps<"index">;

export default function HomeScreen() {
  const {
    data: categoriesData,
    isLoading,
    refetch,
    isFetching,
  } = useGetCategoriesQuery();

  // Map API categories to full Category objects with randomized layout properties
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    return mapCategoriesFromApi(categoriesData);
  }, [categoriesData]);

  const { styles, colors } = useThemedStyles((colors) => ({
    loadingContainer: {
      flexGrow: 1,
      minHeight: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  }));

  if (isLoading || isFetching) {
    return (
      <PageLayout shouldShowSafeArea={false}>
        <ThemedView style={styles.loadingContainer} scrollable={false}>
          <ActivityIndicator size="large" color={colors.tint} />
        </ThemedView>
      </PageLayout>
    );
  }

  const handleRefresh = () => {
    refetch();
  };

  const handleCategoryPress = (category: Category) => {
    // Navigate to shop category with 'from' parameter to indicate we came from home
    // Convert category slug to lowercase for URL
    const categorySlug = category.slug.toLowerCase().replace(/\s+/g, "-");

    // Direct navigation to the category screen
    // Note: There may be a brief transition through the shop tab when crossing tab boundaries
    // This is expected behavior in Expo Router when navigating to nested routes in different tabs
    router.push({
      pathname: `/(tabs)/shop/${categorySlug}` as any,
      params: { from: "home" },
    });
  };

  return (
    <PageLayout shouldShowSafeArea={false}>
      <MasonryCategoryList
        categories={categories}
        refreshing={isFetching}
        onRefresh={handleRefresh}
        onCategoryPress={handleCategoryPress}
      />
      {/**
       * This is a test button to trigger an error and test the error boundary.
       * uncomment it to test the error boundary.
       * <ErrorTestButton />
       **/}
    </PageLayout>
  );
}
