"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import React, { useEffect } from "react";
import { getCurrentUser } from "@/store/thunks/authThunk";
const AuthInitialzer = ({ children }) => {
  useEffect(() => {
    console.log("getCurrent user called");
    store.dispatch(getCurrentUser());
  }, []);

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
