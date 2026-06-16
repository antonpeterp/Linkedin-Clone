import React, { createContext, useState } from "react";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {
  const serverURL = import.meta.env.VITE_BACKEND_URI || "";

  let value = {
    serverURL,
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
};

export default AuthContext;
