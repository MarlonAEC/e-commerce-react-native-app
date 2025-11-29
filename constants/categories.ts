import { Category } from "@/@types/categories";

export const categories: Category[] = [
  {
    id: "1",
    slug: "new-collection",
    title: "New collection",
    image: require("../assets/images/categories/image 3.png"),
    alt: "Woman sitting on a black leather couch wearing a dark grey tracksuit with white stripes and light pink sneakers, against a vibrant pink background",
    span: 2,
    textPosition: "bottom-right",
  },
  {
    id: "2",
    slug: "summer-sale",
    title: "Summer sale",
    image: require("../assets/images/categories/image 4.png"),
    alt: "Woman with dark hair wearing black sunglasses and a light blue denim jacket, leaning against a red wall with red lipstick",
    span: 1,
    textPosition: "center",
    // No textBackgroundColor - will use transparent background with white text
  },
  {
    id: "3",
    slug: "mens-hoodies",
    title: "Men's hoodies",
    image: require("../assets/images/categories/image 1.png"),
    alt: "Man with short hair and glasses wearing a mustard yellow hoodie, looking to his left, with a blurred urban building background with many windows",
    span: 1,
    textPosition: "bottom-left",
    height: 400, // Twice the default height (200 * 2)
  },
  {
    id: "4",
    slug: "black",
    title: "Black",
    image: require("../assets/images/categories/image 2.png"),
    alt: "Woman with dark hair and round sunglasses wearing a black high-neck top or jacket, looking upwards and to her right, against a plain dark grey background",
    span: 1,
    textPosition: "bottom-left",
  },
];
