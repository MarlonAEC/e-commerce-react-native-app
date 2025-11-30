import { ThemedView } from "@/components/themed-view";
import { MinusIcon } from "@/components/ui/svg-icons/minus-icon";
import { PlusIcon } from "@/components/ui/svg-icons/plus-icon";
import { ThreeDotsIcon } from "@/components/ui/svg-icons/three-dots-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { Image, Platform, TouchableOpacity } from "react-native";

type BagItemProps = {
  thumbnail: string;
  name: string;
  color: string;
  id: string;
  price: number;
  quantity: number;
  totalPrice: number;
  discountPercentage: number;
  discountedTotal: number;
  onQuantityChange: (quantity: number) => void;
};

export default function BagItem({
  thumbnail,
  name,
  color,
  id,
  price,
  quantity,
  totalPrice,
  discountPercentage,
  discountedTotal,
  onQuantityChange,
}: BagItemProps) {
  const { styles } = useThemedStyles((colors) => ({
    container: {
      backgroundColor: colors.background,
      width: "100%",
      height: 104, // Fixed height, not minHeight
      flexDirection: "row",
      marginBottom: 16,
      borderRadius: 8,
      // Box shadow: 0px 1px 8px rgba(0, 0, 0, 0.05)
      // Increased shadow radius for better visibility on all sides
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 10, // Increased radius for better side visibility
          }
        : {
            elevation: 4, // Increased elevation for Android
          }),
    },
    innerContainer: {
      flex: 1,
      flexDirection: "row",
      borderRadius: 8,
      overflow: "hidden", // Clip children to border radius
      height: 104, // Fixed height to match container
    },
    imageContainer: {
      width: 104,
      height: 104, // Fixed height to match container
      overflow: "hidden",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    detailsContainer: {
      flex: 1,
      flexDirection: "column",
      paddingHorizontal: 12,
      paddingVertical: 10, // Reduced from 16 to fit 104px height
      justifyContent: "space-between",
    },
    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 6, // Reduced from 8 to fit 104px height
    },
    nameAndAttributes: {
      flex: 1,
      flexDirection: "column",
      marginRight: 8,
    },
    productName: {
      marginBottom: 2, // Reduced from 4 to fit 104px height
    },
    attributesRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    threeDotsButton: {
      padding: 4,
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    quantityIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      // Box shadow: 0px 1px 8px rgba(0, 0, 0, 0.05)
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }
        : {
            elevation: 2,
          }),
    },
    quantityText: {
      minWidth: 20,
      textAlign: "center",
    },
    priceText: {
      fontWeight: "600",
    },
  }));

  const handleQuantityChange = (change: number) => {
    onQuantityChange && onQuantityChange(quantity + change);
  };

  return (
    <ThemedView style={styles.container} key={id}>
      <ThemedView style={styles.innerContainer}>
        <ThemedView style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/categories/image-1.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </ThemedView>
        <ThemedView style={styles.detailsContainer}>
          {/* Top Row: Product Name, Attributes, and Three Dots */}
          <ThemedView style={styles.topRow}>
            <ThemedView style={styles.nameAndAttributes}>
              <Typography
                variant="body"
                weight="700"
                style={styles.productName}
              >
                {name}
              </Typography>
              <ThemedView style={styles.attributesRow}>
                <Typography variant="bodySmall" color="disabled">
                  Color: {color}
                </Typography>
              </ThemedView>
            </ThemedView>
            <TouchableOpacity style={styles.threeDotsButton}>
              <ThreeDotsIcon />
            </TouchableOpacity>
          </ThemedView>

          {/* Bottom Row: Quantity Controls and Price */}
          <ThemedView style={styles.bottomRow}>
            <ThemedView style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(-1)}
                style={styles.quantityIconContainer}
              >
                <MinusIcon />
              </TouchableOpacity>
              <Typography variant="body" style={styles.quantityText}>
                {quantity}
              </Typography>
              <TouchableOpacity
                onPress={() => handleQuantityChange(1)}
                style={styles.quantityIconContainer}
              >
                <PlusIcon />
              </TouchableOpacity>
            </ThemedView>
            <Typography variant="body" weight="600" style={styles.priceText}>
              ${price}
            </Typography>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
