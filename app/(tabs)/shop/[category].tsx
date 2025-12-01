import {
  CategoryDisplay,
  ProductData,
} from "@/components/category/category-display";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-toolkit";
import { addToCart } from "@/redux/cart/cart-slice";
import { logger } from "@/services/logger";
import {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
} from "@/services/store-api/categories";
import { formatCategoryName } from "@/utils/format-category-name";
import { mapProductsFromApi } from "@/utils/map-products";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const LIMIT = 16; // Number of products to fetch per page

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [skip, setSkip] = useState(0);
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);

  // Check if this is the "all" category
  const isAllCategory = category?.toLowerCase() === "all";

  // Format category name from slug
  const categoryName = formatCategoryName(category, isAllCategory);

  // Category slug for API (use the category param directly as it's already the slug)
  const categorySlug = category || "";

  // Fetch products - use different endpoint for "all" category
  const {
    data: productsResponseByCategory,
    isLoading: isLoadingByCategory,
    isFetching: isFetchingByCategory,
    error: errorByCategory,
  } = useGetProductsByCategoryQuery(
    {
      category: categorySlug,
      skip,
      limit: LIMIT,
    },
    {
      skip: !categorySlug || isAllCategory, // Skip if no category slug or if it's "all"
    }
  );

  const {
    data: productsResponseAll,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
    error: errorAll,
  } = useGetAllProductsQuery(
    {
      skip,
      limit: LIMIT,
    },
    {
      skip: !isAllCategory, // Only fetch if it's the "all" category
    }
  );

  // Use the appropriate response based on category type
  const productsResponse = isAllCategory
    ? productsResponseAll
    : productsResponseByCategory;
  const isLoading = isAllCategory ? isLoadingAll : isLoadingByCategory;
  const isFetching = isAllCategory ? isFetchingAll : isFetchingByCategory;
  const error = isAllCategory ? errorAll : errorByCategory;

  // Update allProducts when new data arrives
  useEffect(() => {
    if (productsResponse?.products) {
      const mappedProducts = mapProductsFromApi(productsResponse.products);
      if (skip === 0) {
        // First page - replace all products
        setAllProducts(mappedProducts);
      } else {
        // Subsequent pages - append products, avoiding duplicates by ID
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = mappedProducts.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prev, ...newProducts];
        });
      }
    }
  }, [productsResponse?.products, skip]); // Only depend on products array, not entire response

  // Check if there are more products to load
  const hasMore = productsResponse
    ? skip + LIMIT < productsResponse.total
    : false;

  // Load more products
  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setSkip((prev) => prev + LIMIT);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // Reset skip when category changes
  useEffect(() => {
    setSkip(0);
    setAllProducts([]);
  }, [categorySlug]);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleAddToCart = async (product: ProductData) => {
    if (!user) {
      logger.warn("Cannot add to cart: User not logged in");
      return;
    }

    try {
      // Use thumbnail from ProductData if available, otherwise extract from ImageSource
      let thumbnail = product.thumbnail || "";
      if (!thumbnail && typeof product.image === "string") {
        thumbnail = product.image;
      } else if (
        !thumbnail &&
        product.image &&
        typeof product.image === "object"
      ) {
        if ("uri" in product.image) {
          thumbnail = (product.image.uri as string) || "";
        } else if ("localUri" in product.image) {
          thumbnail = (product.image.localUri as string) || "";
        }
      }

      // Convert product ID from string to number
      const productId = parseInt(product.id, 10);
      if (isNaN(productId)) {
        logger.error(
          "Invalid product ID",
          new Error(`Cannot parse product ID: ${product.id}`)
        );
        return;
      }

      // Dispatch add to cart action
      await dispatch(
        addToCart({
          product: {
            id: productId,
            title: product.title,
            price: product.originalPrice, // Use original price, not discounted
            discountPercentage: product.discountPercentage || 0,
            thumbnail,
          },
          userId: user.id,
        })
      ).unwrap();

      logger.info("Product added to cart", { productId, title: product.title });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Failed to add product to cart", err, {
        productId: product.id,
        title: product.title,
      });
    }
  };

  return (
    <CategoryDisplay
      title={categoryName}
      products={allProducts}
      isLoading={isLoading && skip === 0} // Only show loading on initial load
      error={error ? "Failed to load products" : null}
      onProductPress={(product) => console.log(`Product ${product.id} pressed`)}
      onFavoritePress={(product) =>
        console.log(`Favorite toggled for ${product.id}`)
      }
      onAddToCartPress={handleAddToCart}
      onBackPress={handleBackPress}
      hasMore={hasMore}
      isLoadingMore={isFetching && skip > 0} // Show loading more only when loading subsequent pages
      onLoadMore={handleLoadMore}
    />
  );
}
