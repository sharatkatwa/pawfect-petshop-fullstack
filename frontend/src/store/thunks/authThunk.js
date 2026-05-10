import { getMeApi, loginApi, logoutApi, signupApi } from "@/api/authApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
