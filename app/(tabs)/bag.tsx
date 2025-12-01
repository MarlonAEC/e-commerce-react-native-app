import { CartProduct } from "@/@types/cart";
import PageLayout from "@/components/page-layout";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux-toolkit";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTranslation } from "@/hooks/use-translation";
import {
  decrementQuantity,
  incrementQuantity,
  loadCart,
  removeProductFromCart,
  selectCart,
  selectCartError,
  selectCartLoading,
} from "@/redux/cart/cart-slice";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  View,
  type ViewStyle,
} from "react-native";
import BagItem from "../../components/bag-item";

export default function BagScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // Get logged-in user from Redux
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;

  // Get cart from Redux
  const cart = useAppSelector(selectCart);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);

  // Load cart when user is available
  useEffect(() => {
    if (userId && !cart) {
      dispatch(loadCart(userId));
    }
  }, [userId, cart, dispatch]);

  // Map CartProduct to BagItem format
  const bagItems = useMemo(() => {
    if (!cart?.products || cart.products.length === 0) {
      return [];
    }

    return cart.products.map((product: CartProduct) => ({
      thumbnail: product.thumbnail,
      name: product.title,
      color: "N/A", // Color is not available in the cart
      id: product.id.toString(),
      price: product.price, // Original price per unit
      quantity: product.quantity,
      totalPrice: product.total, // Original total price for this item
      discountedPrice: product.discountedTotal / product.quantity, // Discounted price per unit
      discountedTotal: product.discountedTotal, // Discounted total for this item
      discountPercentage: product.discountPercentage,
    }));
  }, [cart]);

  // Calculate total amounts from cart data
  const totalAmount = useMemo(() => {
    if (!cart) {
      return { total: 0, discountedTotal: 0 };
    }
    return {
      total: cart.total,
      discountedTotal: cart.discountedTotal,
    };
  }, [cart]);

  const { styles, colors } = useThemedStyles((colors) => ({
    mainContainer: {
      flex: 1,
      padding: 16,
    },
    title: {
      marginBottom: 32,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    } as ViewStyle,
    totalSection: {
      marginTop: 24,
      paddingTop: 24,
      paddingBottom: Platform.OS === "ios" ? 100 : 90, // Add padding to account for tab bar
      borderTopWidth: 1,
      borderTopColor: colors.border,
    } as ViewStyle,
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    } as ViewStyle,
    checkoutButton: {
      marginTop: 0,
    } as ViewStyle,
  }));

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log("Checkout pressed");
  };

  const handleRemoveProduct = async (productId: string) => {
    const productIdNum = parseInt(productId, 10);
    if (isNaN(productIdNum)) {
      return;
    }
    try {
      await dispatch(removeProductFromCart(productIdNum)).unwrap();
    } catch (error) {
      // Error is handled by Redux
      console.error("Failed to remove product from cart", error);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const productId = parseInt(itemId, 10);
    const product = cart?.products.find((p) => p.id === productId);

    if (!product) return;

    if (newQuantity > product.quantity) {
      // Increment
      dispatch(incrementQuantity(productId));
    } else if (newQuantity < product.quantity) {
      // Decrement
      dispatch(decrementQuantity(productId));
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout shouldShowSafeArea={true} scrollable={false}>
        <ThemedView style={styles.mainContainer} scrollable={false}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Typography variant="body" color="text" style={{ marginTop: 16 }}>
              {t("bag.loadingBag")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageLayout shouldShowSafeArea={true} scrollable={false}>
        <ThemedView style={styles.mainContainer} scrollable={false}>
          <View style={styles.emptyContainer}>
            <Typography variant="h3" color="text" align="center">
              {t("bag.errorLoadingCart")}
            </Typography>
            <Typography
              variant="body"
              color="text"
              align="center"
              style={{ marginTop: 8 }}
            >
              {t("bag.tryAgainLater")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  // Show empty state
  if (!bagItems || bagItems.length === 0) {
    return (
      <PageLayout shouldShowSafeArea={true} scrollable={false}>
        <ThemedView style={styles.mainContainer} scrollable={false}>
          <Typography variant="h1" style={styles.title}>
            {t("bag.myBag")}
          </Typography>
          <View style={styles.emptyContainer}>
            <Typography variant="h3" color="text" align="center">
              {t("bag.empty")}
            </Typography>
            <Typography
              variant="body"
              color="text"
              align="center"
              style={{ marginTop: 8 }}
            >
              {t("bag.addItemsToGetStarted")}
            </Typography>
          </View>
        </ThemedView>
      </PageLayout>
    );
  }

  return (
    <PageLayout shouldShowSafeArea={true} scrollable={false}>
      <ThemedView style={styles.mainContainer} scrollable={false}>
        <View style={styles.contentContainer}>
          <Typography variant="h1" style={styles.title}>
            {t("bag.myBag")}
          </Typography>
          <FlatList
            data={bagItems}
            renderItem={({ item }) => (
              <BagItem
                {...item}
                onQuantityChange={(newQuantity: number) =>
                  handleQuantityChange(item.id, newQuantity)
                }
                onRemove={() => handleRemoveProduct(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Total Amount and Checkout Button */}
        <View style={styles.totalSection}>
          {totalAmount.total > totalAmount.discountedTotal && (
            <View style={styles.totalRow}>
              <Typography variant="body" color="text">
                {t("bag.originalPrice")}
              </Typography>
              <Typography
                variant="body"
                weight="600"
                style={{ textDecorationLine: "line-through", opacity: 0.5 }}
              >
                ${totalAmount.total.toFixed(2)}
              </Typography>
            </View>
          )}
          <View style={styles.totalRow}>
            <Typography variant="body" color="text">
              {t("bag.total")}:
            </Typography>
            <Typography variant="body" weight="600" customColor={colors.tint}>
              ${totalAmount.discountedTotal.toFixed(2)}
            </Typography>
          </View>
          <Button
            title={t("bag.checkout")}
            onPress={handleCheckout}
            buttonStyle={styles.checkoutButton}
            accessibilityLabel={t("bag.checkoutLabel")}
            accessibilityHint={t("bag.checkoutHint")}
          />
        </View>
      </ThemedView>
    </PageLayout>
  );
}
