// ProtectedUserRoute.jsx
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ element: Component }) => {
  const { user } = useContext(AuthContext);

  // If not logged in, redirect to Login page.
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return <Component />;
};

export default ProtectedUserRoute;
