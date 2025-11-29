import { Category } from "@/@types/categories";

export const categories: Category[] = [
  {
    id: "1",
    title: "New collection",
    image: require("../assets/images/categories/image 3.png"),
    span: 2,
    textPosition: "bottom-right",
  },
  {
    id: "2",
    title: "Summer sale",
    image: require("../assets/images/categories/image 4.png"),
    span: 1,
    textPosition: "center",
    // No textBackgroundColor - will use transparent background with white text
  },
  {
    id: "3",
    title: "Men's hoodies",
    image: require("../assets/images/categories/image 1.png"),
    span: 1,
    textPosition: "bottom-left",
    height: 400, // Twice the default height (200 * 2)
  },
  {
    id: "4",
    title: "Black",
    image: require("../assets/images/categories/image 2.png"),
    span: 1,
    textPosition: "bottom-left",
  },
];
