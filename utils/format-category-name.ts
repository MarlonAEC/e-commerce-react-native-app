/**
 * Formats a category slug into a readable category name.
 * Converts URL-friendly slugs (e.g., "smartphones" or "smart-phones") 
 * into properly capitalized display names (e.g., "Smartphones" or "Smart Phones").
 * 
 * @param categorySlug - The category slug from the URL (e.g., "smartphones", "smart-phones")
 * @param isAllCategory - Whether this is the special "all" category
 * @returns Formatted category name (e.g., "Smartphones", "Smart Phones", "All Products")
 * 
 * @example
 * formatCategoryName("smartphones") // "Smartphones"
 * formatCategoryName("smart-phones") // "Smart Phones"
 * formatCategoryName("all", true) // "All Products"
 */
export function formatCategoryName(
  categorySlug: string | undefined,
  isAllCategory: boolean = false
): string {
  if (!categorySlug) {
    return "Category";
  }

  if (isAllCategory || categorySlug.toLowerCase() === "all") {
    return "All Products";
  }

  // Decode URL-encoded characters and replace hyphens with spaces
  const decoded = decodeURIComponent(categorySlug)
    .replace(/-/g, " ")
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

  return decoded;
}

