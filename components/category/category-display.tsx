import PageLayout from "@/components/page-layout";
import ProductTile from "@/components/product-tile";
import { ThemedView } from "@/components/themed-view";
import { ChevronLeftIcon } from "@/components/ui/svg-icons/chevron-left-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import { ImageSource } from "expo-image";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, View, type ViewStyle } from "react-native";
import { FilterModal, FilterOptions } from "./filter-modal";
import { FilterSortBar, SortOption } from "./filter-sort-bar";
import { SortModal } from "./sort-modal";

export type ProductData = {
  id: string;
  image: ImageSource;
  thumbnail?: string; // Thumbnail URL for cart
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  title: string;
  originalPrice: number;
  price: number;
  isFavorite?: boolean;
};

export type CategoryDisplayProps = {
  /**
   * Category title/name
   */
  title: string;
  /**
   * Array of products to display
   */
  products: ProductData[];
  /**
   * Callback when a product is pressed
   */
  onProductPress?: (product: ProductData) => void;
  /**
   * Callback when favorite button is pressed
   */
  onFavoritePress?: (product: ProductData) => void;
  /**
   * Callback when add to cart button is pressed
   */
  onAddToCartPress?: (product: ProductData) => void;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Error state
   */
  error?: string | null;
  /**
   * Callback when back button is pressed
   * If provided, shows a header with back button
   */
  onBackPress?: () => void;
  /**
   * Whether there are more products to load (for infinite scroll)
   */
  hasMore?: boolean;
  /**
   * Whether currently loading more products
   */
  isLoadingMore?: boolean;
  /**
   * Callback to load more products (for infinite scroll)
   */
  onLoadMore?: () => void;
};

/**
 * Generic CategoryDisplay component
 * Displays products with filter and sort capabilities
 * Can be reused for any category view
 */
export function CategoryDisplay({
  title,
  products,
  onProductPress,
  onFavoritePress,
  onAddToCartPress,
  isLoading = false,
  error = null,
  onBackPress,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: CategoryDisplayProps) {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState<SortOption | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
    } as ViewStyle,
    content: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
      paddingHorizontal: 4,
    } as ViewStyle,
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    } as ViewStyle,
    backButton: {
      padding: 8,
      marginRight: 12,
    } as ViewStyle,
    headerTitle: {
      flex: 1,
    },
    title: {
      marginBottom: 24,
    },
    productWrapper: {
      flex: 1,
      margin: 8, // Half of the gap between items (16/2)
    } as ViewStyle,
    productWrapperLastOdd: {
      flex: 0,
      maxWidth: "48%", // Constrain to approximately half width to match other items
    } as ViewStyle,
    listContentContainer: {
      paddingHorizontal: 8, // Compensate for item margins
      paddingBottom: 50, // Add padding for tab bar
    } as ViewStyle,
  }));

  // Apply filters and sorting to products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (filters.colors && filters.colors.length > 0) {
      // TODO: Filter by colors when product data includes color information
    }
    if (filters.sizes && filters.sizes.length > 0) {
      // TODO: Filter by sizes when product data includes size information
    }
    if (filters.category && filters.category !== "All") {
      // TODO: Filter by category when product data includes category information
    }
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter(
        (product) => product.brand && filters.brands?.includes(product.brand)
      );
    }
    if (filters.priceRange) {
      result = result.filter(
        (product) =>
          product.price >= (filters.priceRange?.min || 0) &&
          product.price <= (filters.priceRange?.max || Infinity)
      );
    }

    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case "price_low_high":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_high_low":
          result.sort((a, b) => b.price - a.price);
          break;
        case "customer_review":
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
          // TODO: Sort by newest when product data includes date information
          break;
        case "popular":
          // TODO: Sort by popularity when product data includes popularity information
          break;
      }
    }

    return result;
  }, [products, filters, sortOption]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return (
      (filters.colors?.length || 0) +
      (filters.sizes?.length || 0) +
      (filters.category && filters.category !== "All" ? 1 : 0) +
      (filters.brands?.length || 0) +
      (filters.priceRange ? 1 : 0)
    );
  }, [filters]);

  const renderProduct = ({
    item,
    index,
  }: {
    item: ProductData;
    index: number;
  }) => {
    const isLastItem = index === filteredAndSortedProducts.length - 1;
    const isOddCount = filteredAndSortedProducts.length % 2 !== 0;
    const shouldConstrainWidth = isLastItem && isOddCount;

    return (
      <View
        style={[
          styles.productWrapper,
          shouldConstrainWidth && styles.productWrapperLastOdd,
        ]}
      >
        <ProductTile
          image={item.image}
          discountPercentage={item.discountPercentage}
          rating={item.rating}
          reviewCount={item.reviewCount}
          brand={item.brand}
          title={item.title}
          originalPrice={item.originalPrice}
          price={item.price}
          isFavorite={item.isFavorite}
          mode="shop"
          onPress={() => onProductPress?.(item)}
          onFavoritePress={() => onFavoritePress?.(item)}
          onAddToCartPress={() => onAddToCartPress?.(item)}
        />
      </View>
    );
  };

  return (
    <PageLayout shouldShowSafeArea={true} scrollable={false}>
      <ThemedView style={styles.container} scrollable={false}>
        <ThemedView style={styles.content} scrollable={false}>
          {/* Header with back button */}
          {onBackPress && (
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Pressable
                  style={styles.backButton}
                  onPress={onBackPress}
                  accessibilityRole="button"
                  accessibilityLabel={t("shop.goBack")}
                  accessibilityHint={t("shop.goBackHint")}
                >
                  <ChevronLeftIcon fill={colors.text} />
                </Pressable>
                <Typography variant="h1" style={styles.headerTitle}>
                  {title}
                </Typography>
              </View>
            </View>
          )}

          {/* Title (only show if no header) */}
          {!onBackPress && (
            <Typography variant="h1" style={styles.title}>
              {title}
            </Typography>
          )}

          <FilterSortBar
            currentSort={sortOption}
            onFilterPress={() => setShowFilterModal(true)}
            onSortPress={() => setShowSortModal(true)}
            activeFilterCount={activeFilterCount}
          />

          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body" color="text">
                {t("shop.loadingProducts")}
              </Typography>
            </View>
          ) : error ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body" color="text">
                {error}
              </Typography>
            </View>
          ) : filteredAndSortedProducts.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body" color="text">
                {t("shop.noProductsFound")}
              </Typography>
            </View>
          ) : (
            <FlatList
              data={filteredAndSortedProducts}
              renderItem={renderProduct}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              onEndReached={() => {
                if (hasMore && !isLoadingMore && onLoadMore) {
                  onLoadMore();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <View
                    style={{
                      paddingVertical: 20,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="bodySmall" color="text">
                      {t("shop.loadingMore")}
                    </Typography>
                  </View>
                ) : null
              }
            />
          )}
        </ThemedView>

        {/* Sort Modal */}
        <SortModal
          visible={showSortModal}
          currentSort={sortOption}
          onSelectSort={setSortOption}
          onClose={() => setShowSortModal(false)}
        />

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          filters={filters}
          onApplyFilters={setFilters}
          onClose={() => setShowFilterModal(false)}
          onDiscard={() => setFilters({})}
        />
      </ThemedView>
    </PageLayout>
  );
}
