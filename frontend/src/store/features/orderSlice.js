import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  cancelOrder,
  checkoutFromCart,
  createOrder,
  createRazorpayOrder,
  getMyOrders,
  getSellerOrders,
  getSingleOrder,
  updateOrderStatus,
  verifyRazorpayPayment,
} from "../thunks/orderThunk";

const initialState = {
  orders: [],
  sellerOrders: [],
  order: null,
  latestOrder: null,
  razorpayOrder: null,
  totalOrders: 0,
  sellerTotalOrders: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  checkoutLoading: false,
  error: null,
};

const replaceOrder = (orders, updatedOrder) => {
  return orders.map((order) =>
    order._id === updatedOrder._id ? updatedOrder : order,
  );
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearLatestOrder: (state) => {
      state.latestOrder = null;
    },
    clearSingleOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.error = null;
        state.latestOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(checkoutFromCart.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(checkoutFromCart.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.error = null;
        state.latestOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(checkoutFromCart.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(createRazorpayOrder.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
        state.razorpayOrder = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.error = null;
        state.razorpayOrder = action.payload.razorpayOrder;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
        state.razorpayOrder = null;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.checkoutLoading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.error = null;
        state.latestOrder = action.payload.order;
        state.razorpayOrder = null;
        state.orders.unshift(action.payload.order);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders || [];
        state.totalOrders =
          action.payload.totalOrders || action.payload.orders?.length || 0;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sellerOrders = action.payload.orders || [];
        state.sellerTotalOrders = action.payload.totalOrders || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.order = action.payload.order;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        state.loading = false;
        state.error = null;
        state.order = updatedOrder;
        state.orders = replaceOrder(state.orders, updatedOrder);
        state.sellerOrders = replaceOrder(state.sellerOrders, updatedOrder);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        state.loading = false;
        state.error = null;
        state.order = updatedOrder;
        state.orders = replaceOrder(state.orders, updatedOrder);
        state.sellerOrders = replaceOrder(state.sellerOrders, updatedOrder);
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

export const { clearLatestOrder, clearOrderError, clearSingleOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
