// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("userData");
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
  }, []);

  // Login function to update auth state
  const login = (token, userData) => {
    setAuth({ token, user: userData });
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Logout function to clear auth state
  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
