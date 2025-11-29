import { ImageSource } from "expo-image";

export interface Category {
  id: string;
  title: string;
  image: ImageSource;
  /**
   * Alt text for the category image (used for accessibility)
   * Describes what the image shows
   */
  alt: string;
  span: number;
  /**
   * Optional callback when category is pressed
   * If not provided, can use default navigation behavior
   */
  onPress?: () => void;
  /**
   * Text position for overlay text
   * @default "bottom-left"
   */
  textPosition?: "bottom-left" | "bottom-right" | "center";
  /**
   * Background color for text overlay (if image has text overlay)
   * If not provided, text will be white without background
   */
  textBackgroundColor?: string;
  /**
   * Custom height for the category card in pixels
   * If not provided, defaults to 300 for span=2, 200 for span=1
   */
  height?: number;
}
