import { ThemedView } from "@/components/themed-view";
import { MinusIcon } from "@/components/ui/svg-icons/minus-icon";
import { PlusIcon } from "@/components/ui/svg-icons/plus-icon";
import { ThreeDotsIcon } from "@/components/ui/svg-icons/three-dots-icon";
import { Typography } from "@/components/ui/typography";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

type BagItemProps = {
  thumbnail: string;
  name: string;
  color: string;
  id: string;
  price: number; // Original price per unit
  quantity: number;
  totalPrice: number; // Original total price
  discountedPrice: number; // Discounted price per unit
  discountedTotal: number; // Discounted total price
  discountPercentage: number;
  onQuantityChange: (quantity: number) => void;
  onRemove?: () => void;
};

export default function BagItem({
  thumbnail,
  name,
  color,
  id,
  price,
  quantity,
  totalPrice,
  discountedPrice,
  discountedTotal,
  discountPercentage,
  onQuantityChange,
  onRemove,
}: BagItemProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<View>(null);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const { styles, colors } = useThemedStyles((colors) => ({
    container: {
      backgroundColor: colors.background,
      width: "100%",
      minHeight: 104, // Minimum height, but can grow
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
    },
    imageContainer: {
      width: 104,
      minHeight: 104, // Minimum height to match min container height
      maxHeight: 150, // Maximum height to prevent card from getting too large
      overflow: "hidden",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    image: {
      width: "100%",
      height: "100%",
      minHeight: 104, // Match minimum container height
      maxHeight: 150, // Match maximum container height
    },
    detailsContainer: {
      flex: 1,
      flexDirection: "column",
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    nameAndAttributes: {
      flex: 1,
      flexDirection: "column",
      marginRight: 8,
    },
    productName: {
      marginBottom: 8,
    },
    colorAndPriceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    colorContainer: {
      flex: 1,
    },
    attributesRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    threeDotsButton: {
      padding: 4,
      position: "relative",
    } as ViewStyle,
    threeDotsContainer: {
      position: "relative",
    } as ViewStyle,
    quantityRow: {
      flexDirection: "row",
      alignItems: "center",
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
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    } as ViewStyle,
    originalPriceText: {
      textDecorationLine: "line-through",
      opacity: 0.5,
    },
    discountedPriceText: {
      fontWeight: "600",
    },
    dropdownContainer: {
      position: "absolute",
      top: -5,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: 8,
      minWidth: 160,
      // Box shadow
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }
        : {
            elevation: 8,
          }),
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
    } as ViewStyle,
    dropdownOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    dropdownOptionLast: {
      borderBottomWidth: 0,
    } as ViewStyle,
    dropdownOptionText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownOptionTextDanger: {
      color: colors.tint,
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
            source={{ uri: thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        </ThemedView>
        <ThemedView style={styles.detailsContainer}>
          {/* Top Row: Product Name and Three Dots */}
          <ThemedView style={styles.topRow}>
            <ThemedView style={styles.nameAndAttributes}>
              <Typography
                variant="body"
                weight="700"
                style={styles.productName}
              >
                {name.length > 20 ? `${name.substring(0, 20)}...` : name}
              </Typography>
            </ThemedView>
            <View style={styles.threeDotsContainer}>
              <View ref={buttonRef}>
                <TouchableOpacity
                  style={styles.threeDotsButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Measure button position when pressed
                    buttonRef.current?.measure(
                      (fx, fy, fwidth, fheight, px, py) => {
                        setButtonPosition({
                          x: px,
                          y: py,
                          width: fwidth,
                          height: fheight,
                        });
                        setShowDropdown(!showDropdown);
                      }
                    );
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="More options"
                  accessibilityHint="Open menu to remove item from cart"
                >
                  <ThreeDotsIcon />
                </TouchableOpacity>
              </View>
              {showDropdown && buttonPosition && (
                <Modal
                  visible={showDropdown}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowDropdown(false)}
                >
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }}
                    onPress={() => setShowDropdown(false)}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: buttonPosition.y + buttonPosition.height + 4,
                        right:
                          Dimensions.get("window").width -
                          buttonPosition.x -
                          buttonPosition.width,
                      }}
                    >
                      <View style={styles.dropdownContainer}>
                        {onRemove && (
                          <Pressable
                            style={[
                              styles.dropdownOption,
                              styles.dropdownOptionLast,
                            ]}
                            onPress={() => {
                              onRemove();
                              setShowDropdown(false);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Remove"
                            accessibilityHint="Remove this item from your cart"
                          >
                            <Typography
                              variant="body"
                              style={[
                                styles.dropdownOptionText,
                                styles.dropdownOptionTextDanger,
                              ]}
                            >
                              Remove
                            </Typography>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </Pressable>
                </Modal>
              )}
            </View>
          </ThemedView>

          {/* Second Row: Color and Price */}
          <ThemedView style={styles.colorAndPriceRow}>
            <ThemedView style={styles.colorContainer}>
              <Typography variant="bodySmall" color="disabled">
                Color: {color}
              </Typography>
            </ThemedView>
            <View style={styles.priceContainer}>
              {totalPrice > discountedTotal && (
                <Typography
                  variant="bodySmall"
                  style={styles.originalPriceText}
                >
                  ${totalPrice.toFixed(2)}
                </Typography>
              )}
              <Typography
                variant="body"
                weight="600"
                customColor={colors.tint}
                style={styles.discountedPriceText}
              >
                ${discountedTotal.toFixed(2)}
              </Typography>
            </View>
          </ThemedView>

          {/* Third Row: Quantity Controls */}
          <ThemedView style={styles.quantityRow}>
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
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
