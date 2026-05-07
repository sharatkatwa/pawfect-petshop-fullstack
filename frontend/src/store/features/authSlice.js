import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser } from "../thunks/authThunk";
import { toast } from "sonner";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
   
    logout: (state) => {
      ((state.user = null), (state.token = null), (isAuthenticated = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('pending login');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('fulfilled login');
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        toast.success(action.payload.message,{ position: "top-center" })
        
        // console.log(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('rejected login');
        state.loading = false;
        state.error = action.payload;
        console.log(action.payload);
        toast.error(action.payload,{ position: "top-center" })
        
      })
      .addCase(getCurrentUser.fulfilled,(state,action) =>{
        state.user = action.payload.user
        state.isAuthenticated = true
      })
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
