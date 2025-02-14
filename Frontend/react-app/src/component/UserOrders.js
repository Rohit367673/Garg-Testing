import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

const UserOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    fetch(`http://localhost:3001/user-orders/${user.id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view your orders.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f8f8f8" }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="text.primary">
        My Orders
      </Typography>

      {loading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box textAlign="center" color="error.main">
          <Typography variant="h6">{error}</Typography>
        </Box>
      )}

      {orders.length === 0 && !loading && (
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary">
            No orders found.
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6">Order ID: {order._id}</Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {order.orderStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Payment Status:</strong> {order.paymentStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total:</strong> ₹{order.totalAmount}
              </Typography>

              <Box mt={2}>
                <Typography variant="body1" fontWeight="bold">
                  Items:
                </Typography>
                {order.cartItems.map((item, index) => (
  <Box key={index} sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
    <img
      src={item.imgsrc}       // using "imgsrc" as stored
      alt={item.productName}  // using "productName" as stored
      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 16 }}
    />
    <Box>
      <Typography variant="body1" fontWeight="bold">
        {item.productName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ₹{item.price}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Quantity: {item.quantity}
      </Typography>
      {item.selectedSize && (
        <Typography variant="body2" color="text.secondary">
          Size: {item.selectedSize}
        </Typography>
      )}
      {item.selectedColor && (
        <Typography variant="body2" color="text.secondary">
          Color: {item.selectedColor}
        </Typography>
      )}
    </Box>
  </Box>
))}

              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserOrders;
