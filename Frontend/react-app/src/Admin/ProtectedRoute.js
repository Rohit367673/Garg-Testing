// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, adminRequired = false }) => {
  // Retrieve the token and user data from localStorage.
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (adminRequired) {
    // Check if user exists and has admin privileges
    if (!token || !user || !user.isAdmin) {
      console.log("Admin access denied:", { token: !!token, user, isAdmin: user?.isAdmin });
      return <Navigate to="/Admin/Login" replace />;
    }
  } else {
    // Regular user route protection
    if (!token) {
      return <Navigate to="/Login" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
