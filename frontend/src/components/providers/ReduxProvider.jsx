"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import React, { useEffect } from "react";
import { getCurrentUser } from "@/store/thunks/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist } from "@/store/thunks/wishlistThunk";
import { resetWishlistState } from "@/store/features/wishlistSlice";

const AuthInitialzer = ({ children }) => {
  const dispatch = useDispatch();
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;

    if (isAuthenticated) {
      dispatch(getWishlist());
      return;
    }

    dispatch(resetWishlistState());
  }, [dispatch, initialized, isAuthenticated]);

  return children;
};
const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitialzer>{children}</AuthInitialzer>
    </Provider>
  );
};

export default ReduxProvider;
