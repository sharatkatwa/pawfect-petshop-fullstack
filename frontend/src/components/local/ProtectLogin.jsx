"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ProtectLogin = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated) router.push("/");
  }, [loading, isAuthenticated, router]);
  // console.log(isAuthenticated, user, loading, "helllllllllllllllllllll");
  if (loading) return children;

  if (isAuthenticated && !loading) {
    return null;
  }

  return children;
};

export default ProtectLogin;
