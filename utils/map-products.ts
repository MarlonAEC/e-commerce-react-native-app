import { Product } from "@/@types/product";
import { ProductData } from "@/components/category/category-display";
import { ImageSource } from "expo-image";

/**
 * Maps a Product from API to ProductData for display
 */
export function mapProductFromApi(product: Product): ProductData {
  // Calculate discounted price
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  // Use thumbnail as image source
  // If thumbnail is a URL string, it will work with expo-image
  // If it's a local path, you might need to handle it differently
  const imageSource: ImageSource = product.thumbnail.startsWith("http")
    ? { uri: product.thumbnail }
    : (product.thumbnail as ImageSource);

  return {
    id: product.id.toString(),
    image: imageSource,
    thumbnail: product.thumbnail, // Store original thumbnail URL for cart
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    reviewCount: product.reviews?.length || 0,
    brand: product.brand,
    title: product.title,
    originalPrice: product.price,
    price: discountedPrice,
    isFavorite: false, // Default to false, can be managed by favorites state
  };
}

/**
 * Maps an array of Products from API to ProductData array
 */
export function mapProductsFromApi(products: Product[]): ProductData[] {
  return products.map(mapProductFromApi);
}
