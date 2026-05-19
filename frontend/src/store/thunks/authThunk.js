import {
  deleteUserApi,
  getMeApi,
  loginApi,
  logoutApi,
  signupApi,
  updateUserApi,
} from "@/api/authApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (res, fallback) =>
  res.response?.data?.message || res.response?.data?.error || res.message || fallback;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await loginApi(formData);
      if (res.status !== 200)
        return rejectWithValue(res.response?.data?.message || "login failed");

      return res.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const signupUser = createAsyncThunk("auth/signup", async(formData,{rejectWithValue})=>{
  try {
    const res = await signupApi(formData)
    if(res.status !== 201)
      return rejectWithValue(res.message || 'Signup failed')
    return res.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message)
  }
})
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
      if (res.status !== 200)
        return rejectWithValue(res.message || "logout failed");
      console.log(res.data);
      res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeApi();
      if (res.status !== 200)
        return rejectWithValue(res.message || "Authentication failed /getMe");

      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(id, data);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Profile update failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteUserApi(id);
      if (res.status !== 200) {
        return rejectWithValue(getErrorMessage(res, "Account delete failed"));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
