import api from "./apiInstance";

export const addToCartApi = async (data) => {
  try {
    const res = await api.post("/cart/add", data);
    return res;
  } catch (error) {
    return error;
  }
};

export const getCartApi = async () => {
  try {
    const res = await api.get("/cart");
    return res;
  } catch (error) {
    return error;
  }
};

export const updateCartItemApi = async (productId, data) => {
  try {
    const res = await api.patch(`/cart/item/${productId}`, data);
    return res;
  } catch (error) {
    return error;
  }
};

export const removeCartItemApi = async (productId) => {
  try {
    const res = await api.delete(`/cart/item/${productId}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const clearCartApi = async () => {
  try {
    const res = await api.delete("/cart/clear");
    return res;
  } catch (error) {
    return error;
  }
};
