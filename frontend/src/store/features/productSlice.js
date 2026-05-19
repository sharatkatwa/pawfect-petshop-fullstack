import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../thunks/productThunk";

const initialState = {
  products: [],
  product: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearSingleProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products || [];
        state.total =
          action.payload.totalProducts ||
          action.payload.total ||
          state.products.length;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products.unshift(action.payload.newProduct);
        state.total += 1;
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload.product;

        state.loading = false;
        state.error = null;
        state.product = updatedProduct;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product,
        );
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.id,
        );
        state.total = Math.max(state.total - 1, 0);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export const { clearProductError, clearSingleProduct } = productSlice.actions;
export default productSlice.reducer;
