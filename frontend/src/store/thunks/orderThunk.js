import {
  cancelOrderApi,
  checkoutFromCartApi,
  createOrderApi,
  getMyOrdersApi,
  getSellerOrdersApi,
  getSingleOrderApi,
  updateOrderStatusApi,
} from "@/api/orderApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (res, fallback) =>
  res.response?.data?.message || res.response?.data?.error || res.message || fallback;

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrderApi(data);
      if (res.status !== 201) {
        return rejectWithValue(getErrorMessage(res, "Order create failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const checkoutFromCart = createAsyncThunk(
  "order/checkoutFromCart",
  async (data, { rejectWithValue }) => {
    try {
      const res = await checkoutFromCartApi(data);
      if (res.status !== 201) {
        return rejectWithValue(getErrorMessage(res, "Checkout failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyOrdersApi();
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Orders fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getSellerOrders = createAsyncThunk(
  "order/getSellerOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getSellerOrdersApi(params);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Seller orders fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getSingleOrderApi(id);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Order fetch failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await cancelOrderApi(orderId);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Order cancel failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await updateOrderStatusApi(id, status);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Order status update failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
