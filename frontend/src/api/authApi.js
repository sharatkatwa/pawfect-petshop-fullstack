import api from "./apiInstance";

export const loginApi = async (formData) => {
  try {
    const res = await api.post("/user/login", formData);
    return res;
  } catch (error) {
    return error;
  }
};
export const signupApi = async (formData) =>{
  try {
    const res = await api.post('/user/signup', formData)
    return res;
  } catch (error) {
  console.log(error);
    return error
  }
}
export const getMeApi = async () => {
  try {
    const res = await api.get("/user/me");
    return res;
  } catch (error) {
    return error;
  }
};

export const logoutApi = async () => {
  try {
    const res = await api.post("/user/logout");
    return res;
  } catch (error) {
    return error;
  }
};

export const updateUserApi = async (id, data) => {
  try {
    const res = await api.patch(`/user/update/${id}`, data);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteUserApi = async (id) => {
  try {
    const res = await api.delete(`/user/delete/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};
