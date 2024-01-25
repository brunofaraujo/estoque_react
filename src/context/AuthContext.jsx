import { createContext, useContext } from "react";

const authContext = createContext();

export const AuthProvider = ({ children, value }) => {
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuthValue = () => {
  return useContext(authContext);
};
