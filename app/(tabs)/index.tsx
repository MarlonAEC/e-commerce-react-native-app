import { TabScreenProps } from "@/@types/navigation";
import MasonryCategoryList from "@/components/masonry-category-list";
import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useGetCategoriesQuery } from "@/services/store-api/categories";
import { mapCategoriesFromApi } from "@/utils/map-categories";
import { useMemo } from "react";
import { ActivityIndicator } from "react-native";

type HomeScreenProps = TabScreenProps<"index">;

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
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

  return (
    <PageLayout shouldShowSafeArea={false}>
      <MasonryCategoryList
        categories={categories}
        refreshing={isFetching}
        onRefresh={handleRefresh}
      />
      {/**
       * This is a test button to trigger an error and test the error boundary.
       * uncomment it to test the error boundary.
       * <ErrorTestButton />
       **/}
    </PageLayout>
  );
}
