import { Cart, CartProduct } from "@/@types/cart";
import { logger } from "@/services/logger";
import { RootState } from "@/store";
import { getCartFromStorage, saveCartToStorage } from "@/utils/cart-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

/**
 * Load cart from AsyncStorage
 */
export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (userId: number) => {
    const cart = await getCartFromStorage();
    // If cart exists and belongs to the user, return it
    // Otherwise, create a new empty cart
    if (cart && cart.userId === userId) {
      return cart;
    }
    // Create new empty cart for user
    return {
      id: Date.now(), // Simple ID generation
      products: [],
      total: 0,
      discountedTotal: 0,
      userId,
      totalProducts: 0,
      totalQuantity: 0,
    } as Cart;
  }
);

/**
 * Calculate cart totals based on products
 */
function calculateCartTotals(products: CartProduct[]): {
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
} {
  const total = products.reduce((sum, product) => sum + product.total, 0);
  const discountedTotal = products.reduce(
    (sum, product) => sum + product.discountedTotal,
    0
  );
  const totalProducts = products.length;
  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return { total, discountedTotal, totalProducts, totalQuantity };
}

/**
 * Add product to cart
 */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      product,
      userId,
    }: {
      product: Omit<CartProduct, "quantity" | "total" | "discountedTotal">;
      userId: number;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    let cart = state.cart.cart;

    // If no cart exists, create one
    if (!cart) {
      cart = {
        id: Date.now(),
        products: [],
        total: 0,
        discountedTotal: 0,
        userId,
        totalProducts: 0,
        totalQuantity: 0,
      };
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      (p) => p.id === product.id
    );

    let updatedProducts: CartProduct[];

    if (existingProductIndex >= 0) {
      // Increment quantity if product exists
      const existingProduct = cart.products[existingProductIndex];
      const newQuantity = existingProduct.quantity + 1;
      const newTotal = product.price * newQuantity;
      const newDiscountedTotal =
        newTotal * (1 - product.discountPercentage / 100);

      updatedProducts = [...cart.products];
      updatedProducts[existingProductIndex] = {
        ...existingProduct,
        quantity: newQuantity,
        total: newTotal,
        discountedTotal: newDiscountedTotal,
      };
    } else {
      // Add new product with quantity 1
      const quantity = 1;
      const total = product.price * quantity;
      const discountedTotal = total * (1 - product.discountPercentage / 100);

      updatedProducts = [
        ...cart.products,
        {
          ...product,
          quantity,
          total,
          discountedTotal,
        },
      ];
    }

    // Calculate new totals
    const totals = calculateCartTotals(updatedProducts);

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
      ...totals,
    };

    // Save to AsyncStorage
    await saveCartToStorage(updatedCart);

    return updatedCart;
  }
);

/**
 * Remove product from cart
 */
export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const cart = state.cart.cart;

    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedProducts = cart.products.filter((p) => p.id !== productId);
    const totals = calculateCartTotals(updatedProducts);

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
      ...totals,
    };

    // Save to AsyncStorage
    await saveCartToStorage(updatedCart);

    return updatedCart;
  }
);

/**
 * Increment product quantity
 */
export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const cart = state.cart.cart;

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex((p) => p.id === productId);
    if (productIndex < 0) {
      throw new Error("Product not found in cart");
    }

    const product = cart.products[productIndex];
    const newQuantity = product.quantity + 1;
    const newTotal = product.price * newQuantity;
    const newDiscountedTotal =
      newTotal * (1 - product.discountPercentage / 100);

    const updatedProducts = [...cart.products];
    updatedProducts[productIndex] = {
      ...product,
      quantity: newQuantity,
      total: newTotal,
      discountedTotal: newDiscountedTotal,
    };

    const totals = calculateCartTotals(updatedProducts);

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
      ...totals,
    };

    // Save to AsyncStorage
    await saveCartToStorage(updatedCart);

    return updatedCart;
  }
);

/**
 * Decrement product quantity
 */
export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const cart = state.cart.cart;

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex((p) => p.id === productId);
    if (productIndex < 0) {
      throw new Error("Product not found in cart");
    }

    const product = cart.products[productIndex];
    const newQuantity = Math.max(0, product.quantity - 1);

    let updatedProducts: CartProduct[];

    if (newQuantity === 0) {
      // Remove product if quantity reaches 0
      updatedProducts = cart.products.filter((p) => p.id !== productId);
    } else {
      const newTotal = product.price * newQuantity;
      const newDiscountedTotal =
        newTotal * (1 - product.discountPercentage / 100);

      updatedProducts = [...cart.products];
      updatedProducts[productIndex] = {
        ...product,
        quantity: newQuantity,
        total: newTotal,
        discountedTotal: newDiscountedTotal,
      };
    }

    const totals = calculateCartTotals(updatedProducts);

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
      ...totals,
    };

    // Save to AsyncStorage
    await saveCartToStorage(updatedCart);

    return updatedCart;
  }
);

/**
 * Clear entire cart
 */
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const cart = state.cart.cart;

    if (!cart) {
      return null;
    }

    const emptyCart: Cart = {
      ...cart,
      products: [],
      total: 0,
      discountedTotal: 0,
      totalProducts: 0,
      totalQuantity: 0,
    };

    // Save to AsyncStorage
    await saveCartToStorage(emptyCart);

    return emptyCart;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Load cart
    builder
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load cart";
        logger.error(
          "Failed to load cart",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add to cart";
        logger.error(
          "Failed to add to cart",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Remove product from cart
    builder
      .addCase(removeProductFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.error = action.error.message || "Failed to remove product";
        logger.error(
          "Failed to remove product from cart",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Increment quantity
    builder
      .addCase(incrementQuantity.pending, (state) => {
        state.error = null;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to increment quantity";
        logger.error(
          "Failed to increment quantity",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Decrement quantity
    builder
      .addCase(decrementQuantity.pending, (state) => {
        state.error = null;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to decrement quantity";
        logger.error(
          "Failed to decrement quantity",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.error.message || "Failed to clear cart";
        logger.error(
          "Failed to clear cart",
          action.error instanceof Error
            ? action.error
            : new Error(action.error.message || "Unknown error")
        );
      });
  },
});

export default cartSlice.reducer;
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
