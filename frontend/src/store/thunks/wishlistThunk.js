import {
  addToWishlistApi,
  clearWishlistApi,
  getWishlistApi,
  removeFromWishlistApi,
} from "@/api/wishlistApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (res, fallback) =>
  res.response?.data?.message || res.response?.data?.error || res.message || fallback;

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await addToWishlistApi(productId);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Add to wishlist failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWishlistApi();
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Wishlist fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await removeFromWishlistApi(productId);
      if (res.status !== 200) {
        return rejectWithValue(
          getErrorMessage(res, "Remove wishlist item failed"),
        );
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await clearWishlistApi();
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Clear wishlist failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
