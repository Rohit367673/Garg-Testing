import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, } from "@mui/material";
import { useParams } from "react-router-dom";

const Orders = () => {
  const { orderId } = useParams(); // Get orderId from URL params
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Order ID:", orderId); // Debugging log

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    // Fetch order details from the backend
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong while fetching the order details.");
        }

        setOrderDetails(data.order); // Set the fetched order details
        setLoading(false);
      } catch (err) {
        setError("Failed to load order details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading order details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="text.primary">
        Order Details
      </Typography>
      
      {/* Order Info Section */}
      <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2, boxShadow: 1, marginBottom: 3 }}>
        <Typography variant="h6" color="text.primary">
          Order ID: {orderDetails._id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Payment ID:</strong> {orderDetails.paymentId}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Status:</strong> {orderDetails.status}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Total Amount:</strong> ₹{orderDetails.totalAmount}
        </Typography>
      </Box>

      {/* Products Section */}
      {orderDetails.products.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No products in this order.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {orderDetails.products.map((item) => (
              <Box
                key={item.productId._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  marginBottom: 3,
                }}
              >
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="text.primary">
                    {item.productId.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {item.selectedSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color: {item.selectedColor}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Price: ₹{item.productId.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Orders;
