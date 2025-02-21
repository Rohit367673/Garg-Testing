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
   
    if (!token || !user || !user.isAdmin) {
      return <Navigate to="/Admin/Login" replace />;
    }
  } else {
    
    if (!token) {
      return <Navigate to="/Login" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
