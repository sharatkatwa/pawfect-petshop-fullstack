import api from "./apiInstance";

export const getAllProductsApi = async (params = {}) => {
  try {
    const res = await api.get("/product/all",{params});
    return res;
  } catch (error) {
    return error;
  }
};

export const getMyProductsApi = async (params = {}) => {
  try {
    const res = await api.get("/product/my-products", { params });
    return res;
  } catch (error) {
    return error;
  }
};

export const getSingleProductApi = async (id) => {
  try {
    const res = await api.get(`/product/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const createProductApi = async (formData) => {
  try {
    const res = await api.post("/product/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateProductApi = async (id, formData) => {
  try {
    const res = await api.patch(`/product/update/${id}`, formData);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteProductApi = async (id) => {
  try {
    const res = await api.delete(`/product/remove/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const getProductReviewsApi = async (productId, params = {}) => {
  try {
    const res = await api.get(`/product/${productId}/reviews`, { params });
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteProductReviewApi = async (productId, reviewId) => {
  try {
    const res = await api.delete(`/product/${productId}/review/${reviewId}`);
    return res;
  } catch (error) {
    return error;
  }
};
