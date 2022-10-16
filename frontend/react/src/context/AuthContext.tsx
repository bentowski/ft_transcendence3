import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

const AuthProvider = (props: any) => {
  useEffect(() => {}, []);

  const authContextValue: any = [];
  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
