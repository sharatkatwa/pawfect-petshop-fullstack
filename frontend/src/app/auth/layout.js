"use client";

import ProtectLogin from "@/components/local/ProtectLogin";

  

const AuthLayout = ({ children }) => {
  return<ProtectLogin>
    {children}
  </ProtectLogin>
};

export default AuthLayout;
