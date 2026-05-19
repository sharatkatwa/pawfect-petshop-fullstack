import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "../thunks/wishlistThunk";

const setWishlistState = (state, wishlist) => {
  state.wishlist = wishlist || null;
  state.items = wishlist?.items || [];
  state.totalItems = wishlist?.items?.length || 0;
};

const initialState = {
  wishlist: null,
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    resetWishlistState: (state) => {
      state.wishlist = null;
      state.items = [];
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setWishlistState(state, action.payload.wishlist);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setWishlistState(state, action.payload.wishlist);
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setWishlistState(state, action.payload.wishlist);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        setWishlistState(state, action.payload.wishlist);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export const { clearWishlistError, resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
