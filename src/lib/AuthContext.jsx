import React, { createContext, useContext } from 'react';

// Auth is not used in this application — this is a placeholder to prevent build errors.
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
