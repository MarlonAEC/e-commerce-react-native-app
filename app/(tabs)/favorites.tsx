import { Product } from "@/@types/product";
import PageLayout from "@/components/page-layout";
import ProductTile from "@/components/product-tile";
import { ThemedView } from "@/components/themed-view";
import { Typography } from "@/components/ui/typography";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-toolkit";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import { addToCart } from "@/redux/cart/cart-slice";
import {
  loadFavorites,
  removeFromFavorites,
  selectFavorites,
  selectFavoritesLoading,
} from "@/redux/favorites/favorites-slice";
import { logger } from "@/services/logger";
import { mapProductsFromApi } from "@/utils/map-products";
import { ImageSource } from "expo-image";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  View,
  type ViewStyle,
} from "react-native";

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const user = useAppSelector((state) => state.auth.user);

  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
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
      paddingBottom: Platform.OS === "ios" ? 100 : 90, // Add padding for tab bar
    } as ViewStyle,
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    } as ViewStyle,
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,
  }));

  // Load favorites on mount
  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  // Map favorites to ProductData format
  const productData = useMemo(() => {
    return favorites.map((product: Product) => {
      // Map Product to ProductData format
      const mapped = mapProductsFromApi([product])[0];
      return {
        ...mapped,
        id: product.id.toString(),
        image: product.thumbnail
          ? ({ uri: product.thumbnail } as ImageSource)
          : (product.images?.[0]
              ? ({ uri: product.images[0] } as ImageSource)
              : require("@/assets/images/icon.png")),
      };
    });
  }, [favorites]);

  const handleProductPress = (product: Product) => {
    logger.info("Product pressed", { productId: product.id });
    // TODO: Navigate to product detail page
  };

  const handleQuickAddToCart = async (product: Product) => {
    if (!user) {
      logger.warn("Cannot add to cart: User not logged in");
      return;
    }

    try {
      // Add to cart
      await dispatch(
        addToCart({
          product: {
            id: product.id,
            title: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage || 0,
            thumbnail: product.thumbnail,
          },
          userId: user.id,
        })
      ).unwrap();

      // Remove from favorites after successfully adding to cart
      await dispatch(removeFromFavorites(product.id)).unwrap();

      logger.info("Product added to cart and removed from favorites", {
        productId: product.id,
        title: product.title,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Failed to add product to cart from favorites", err, {
        productId: product.id,
        title: product.title,
      });
    }
  };

  const handleRemoveFromFavorites = async (productId: number) => {
    try {
      await dispatch(removeFromFavorites(productId)).unwrap();
      logger.info("Product removed from favorites", { productId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Failed to remove product from favorites", err, {
        productId,
      });
    }
  };

  const renderProduct = ({
    item,
    index,
  }: {
    item: (typeof productData)[0];
    index: number;
  }) => {
    const isLastItem = index === productData.length - 1;
    const isOddCount = productData.length % 2 !== 0;
    const shouldConstrainWidth = isLastItem && isOddCount;

    // Find the original Product object
    const originalProduct = favorites.find(
      (p) => p.id.toString() === item.id
    ) as Product | undefined;

    if (!originalProduct) return null;

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
          isFavorite={true}
          mode="favorites"
          onPress={() => handleProductPress(originalProduct)}
          onQuickAddToCartPress={() => handleQuickAddToCart(originalProduct)}
          onFavoritePress={() => handleRemoveFromFavorites(originalProduct.id)}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <PageLayout shouldShowSafeArea={true} scrollable={false}>
        <ThemedView style={styles.container} scrollable={false}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Typography variant="body" color="text" style={{ marginTop: 16 }}>
              {t("favorites.loading")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  if (productData.length === 0) {
    return (
      <PageLayout shouldShowSafeArea={true} scrollable={false}>
        <ThemedView style={styles.container} scrollable={false}>
          <Typography variant="h1" style={styles.title}>
            {t("favorites.title")}
          </Typography>
          <View style={styles.emptyContainer}>
            <Typography variant="h3" color="text" align="center">
              {t("favorites.empty")}
            </Typography>
            <Typography
              variant="body"
              color="text"
              align="center"
              style={{ marginTop: 8 }}
            >
              {t("favorites.emptyHint")}
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
          {t("favorites.title")}
        </Typography>
        <FlatList
          data={productData}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      </ThemedView>
    </PageLayout>
  );
}
