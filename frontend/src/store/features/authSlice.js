import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../thunks/authThunk";
import { toast } from "sonner";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    // logout: (state) => {
    //   ((state.user = null),  (isAuthenticated = false));
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        console.log("pending login");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("fulfilled login");
        state.loading = false;
        state.initialized = true;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        toast.success(action.payload.message, { position: "top-center" });

      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("rejected login");
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
        console.log(action.payload);
        toast.error(action.payload, { position: "top-center" });
      })
      // signup starts here
      .addCase(signupUser.pending, (state) => {
        console.log("pending signup");
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("fulfilled signup");
        state.loading = false;
        state.initialized = true;
        state.error = null;
        state.isAuthenticated = true;
        state.user = action.payload.user
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.log("rejected signup");
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
        console.log(action.payload);
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        ((state.user = null),
          (state.isAuthenticated = false),
          (state.initialized = true),
          toast.success("Logged out successfully", { position: "top-center" }));
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
        toast.success(action.payload.message, { position: "top-center" });
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { position: "top-center" });
      });
  },
});

// export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
