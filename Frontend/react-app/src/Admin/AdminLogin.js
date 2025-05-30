// AdminLogin.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../component/AuthContext";
import { toast } from "react-hot-toast";

function AdminLogin() {
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting admin login with:", { Email });
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, {
        Email,
        Pass,
      });
      console.log("Admin login response:", res.data);
      
      if (res.data.message === "Admin login successful") {
        const userData = {
          ...res.data.user,
          isAdmin: true // Add isAdmin flag for ProtectedRoute
        };
        login(res.data.token, userData);
        toast.success("Admin login successful!");
        navigate("/Admin/Product");
      } else {
        setError(res.data.message || "Login failed");
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      const errorMessage = err.response?.data?.message || "Admin login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Admin Login
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            value={Pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter password"
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#3f51b5",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
