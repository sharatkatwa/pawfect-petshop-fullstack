import api from "./apiInstance";

export const addToWishlistApi = async (productId) => {
  try {
    const res = await api.post(`/wishlist/${productId}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getWishlistApi = async () => {
  try {
    const res = await api.get("/wishlist");
    return res;
  } catch (error) {
    return error;
  }
};

export const removeFromWishlistApi = async (productId) => {
  try {
    const res = await api.delete(`/wishlist/${productId}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const clearWishlistApi = async () => {
  try {
    const res = await api.delete("/wishlist");
    return res;
  } catch (error) {
    return error;
  }
};
