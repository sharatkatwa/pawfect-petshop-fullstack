import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "@/api/cartApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (res, fallback) =>
  res.response?.data?.message || res.response?.data?.error || res.message || fallback;

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await addToCartApi({ productId, quantity });
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Add to cart failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Cart fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartItemApi(productId, { quantity });
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Cart update failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeCartItemApi(productId);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Remove cart item failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await clearCartApi();
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Clear cart failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
