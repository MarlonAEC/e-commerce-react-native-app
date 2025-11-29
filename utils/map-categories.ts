import { BaseCategoryFromApi, Category } from "@/@types/categories";
import { ImageSource } from "expo-image";

/**
 * Predefined layout pattern to ensure good visual distribution and avoid white spaces
 * This pattern cycles through different layouts to create a balanced masonry grid
 * The pattern is designed to minimize gaps by alternating full-width and half-width items
 * with varying heights that complement each other
 */
const LAYOUT_PATTERN: {
  span: 1 | 2;
  textPosition: Category["textPosition"];
  height?: number;
}[] = [
  // Pattern designed to fill masonry layout efficiently and minimize white spaces
  // Alternates between full-width (span: 2) and half-width (span: 1) items
  // Heights are carefully chosen to create visual balance

  // Row 1: Start with full-width item
  { span: 2, textPosition: "bottom-right", height: 300 },

  // Row 2: Two half-width items that together match the full-width height
  { span: 1, textPosition: "center", height: 250 },
  { span: 1, textPosition: "bottom-left", height: 300 },

  // Row 3: Two half-width items with complementary heights
  { span: 1, textPosition: "bottom-left", height: 400 },
  { span: 1, textPosition: "bottom-right", height: 350 },

  // Row 4: Full-width item to reset the pattern
  { span: 2, textPosition: "bottom-left", height: 280 },

  // Row 5: Two half-width items
  { span: 1, textPosition: "center", height: 300 },
  { span: 1, textPosition: "bottom-left", height: 250 },

  // Row 6: Two half-width items
  { span: 1, textPosition: "bottom-right", height: 320 },
  { span: 1, textPosition: "center", height: 200 },

  // Row 7: Full-width item
  { span: 2, textPosition: "center", height: 300 },

  // Row 8: Two half-width items
  { span: 1, textPosition: "bottom-left", height: 500 },
  { span: 1, textPosition: "bottom-right", height: 300 },
];

/**
 * Maps a BaseCategoryFromApi to a full Category with predefined layout properties
 * Uses a cycling pattern to ensure good visual distribution and avoid white spaces
 *
 * @param baseCategory - The category data from the API
 * @param index - The index of the category in the array (used to cycle through layout pattern)
 * @returns A Category object with all required fields and predefined span, textPosition, and height
 *
 * @example
 * ```ts
 * const apiCategories = await fetchCategories();
 * const mappedCategories = apiCategories.map((cat, idx) => mapCategoryFromApi(cat, idx));
 * ```
 */
export function mapCategoryFromApi(
  baseCategory: BaseCategoryFromApi,
  index: number
): Category {
  // Cycle through the layout pattern to ensure good distribution
  const layout = LAYOUT_PATTERN[index % LAYOUT_PATTERN.length];

  // Generate alt text from category name
  const alt = `${baseCategory.name} category image`;

  // Convert image URL string to ImageSource
  // For remote URLs, we can use the string directly with expo-image
  const imageSource: ImageSource = { uri: baseCategory.image };

  return {
    ...baseCategory,
    id: String(baseCategory.id), // Convert number ID to string
    title: baseCategory.name, // Map name to title
    image: imageSource,
    alt,
    span: layout.span,
    textPosition: layout.textPosition,
    height: layout.height,
  };
}

/**
 * Maps an array of BaseCategoryFromApi to Category array
 * Uses a predefined layout pattern that cycles to ensure good visual distribution
 *
 * @param baseCategories - Array of categories from the API
 * @returns Array of Category objects with predefined layout properties
 *
 * @example
 * ```ts
 * const { data } = useGetCategoriesQuery();
 * const categories = data ? mapCategoriesFromApi(data) : [];
 * ```
 */
export function mapCategoriesFromApi(
  baseCategories: BaseCategoryFromApi[]
): Category[] {
  return baseCategories.map((category, index) =>
    mapCategoryFromApi(category, index)
  );
}
