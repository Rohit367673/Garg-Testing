import React, { useContext } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { List, ListItem, ListItemText, Typography, Box, Divider } from "@mui/material";
import { AuthContext } from "../component/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Admin/Login');
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f4f9" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#3f51b5",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ marginBottom: 2, textAlign: "center", fontWeight: "bold" }}
        >
          Admin Panel
        </Typography>
        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", marginBottom: 2 }} />
        <List>
          <ListItem button component={Link} to="/Admin/Addproduct" sx={{ color: "#fff" }}>
            <ListItemText primary="Add Product" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/Products" sx={{ color: "#fff" }}>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/AdminOrders" sx={{ color: "#fff" }}>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button component={Link} to="/Admin/Slider" sx={{ color: "#fff" }}>
            <ListItemText primary="Slider" />
          </ListItem>
          {/* Logout Button */}
          <ListItem button onClick={handleLogout} sx={{ color: "#fff" }}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: 3,
          backgroundColor: "#fff",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
