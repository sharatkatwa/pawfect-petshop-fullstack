import {
  createProductApi,
  deleteProductApi,
  getAllProductsApi,
  getSingleProductApi,
  updateProductApi,
} from "@/api/productApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (res, fallback) =>
  res.response?.data?.message || res.response?.data?.error || res.message || fallback;

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (filters ={}, { rejectWithValue }) => {
    try {
      const res = await getAllProductsApi(filters);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Products fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getSingleProductApi(id);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Product fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createProductApi(formData);
      if (res.status !== 201) {
        return rejectWithValue(getErrorMessage(res, "Product create failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updateProductApi(id, formData);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Product update failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteProductApi(id);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Product delete failed"));
      }

      return { ...res.data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
