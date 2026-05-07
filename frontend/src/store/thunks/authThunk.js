import { getMeApi, loginApi } from "@/api/authApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await loginApi(formData)
      if (res.status !== 200)
        return rejectWithValue(res.response?.data?.message || "login failed");
        
      return res.data
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_,{rejectWithValue}) =>{
    try{
      const res = await getMeApi()
      if(res.status !== 200)
        return rejectWithValue(res.message || "Authentication failed /getMe")
        
      console.log(res.data);
      return res.data
      
    }catch(error){
      console.log(error);
      return rejectWithValue(error.message)
    }
  }
)