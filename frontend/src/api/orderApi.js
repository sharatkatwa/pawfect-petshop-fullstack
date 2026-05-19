import api from "./apiInstance";

export const createOrderApi = async (data) => {
  try {
    const res = await api.post("/order", data);
    return res;
  } catch (error) {
    return error;
  }
};

export const checkoutFromCartApi = async (data) => {
  try {
    const res = await api.post("/order/from-cart", data);
    return res;
  } catch (error) {
    return error;
  }
};

export const getMyOrdersApi = async () => {
  try {
    const res = await api.get("/order/my-order");
    return res;
  } catch (error) {
    return error;
  }
};

export const getSellerOrdersApi = async (params = {}) => {
  try {
    const res = await api.get("/order/seller-orders", { params });
    return res;
  } catch (error) {
    return error;
  }
};

export const getSingleOrderApi = async (id) => {
  try {
    const res = await api.get(`/order/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const cancelOrderApi = async (orderId) => {
  try {
    const res = await api.post("/order/cancel", { orderId });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateOrderStatusApi = async (id, status) => {
  try {
    const res = await api.patch(`/order/${id}/status`, { status });
    return res;
  } catch (error) {
    return error;
  }
};
