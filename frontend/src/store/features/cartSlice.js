import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../thunks/cartThunk";

const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const setCartState = (state, cart) => {
  state.cart = cart || null;
  state.items = cart?.items || [];
  state.totalAmount = cart?.totalAmount || 0;
  state.totalItems = getTotalItems(cart?.items || []);
};

const initialState = {
  cart: null,
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    resetCartState: (state) => {
      state.cart = null;
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setCartState(state, action.payload.cart);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setCartState(state, action.payload.cart);
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setCartState(state, action.payload.cart);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setCartState(state, action.payload.cart);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setCartState(state, action.payload.cart);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export const { clearCartError, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
