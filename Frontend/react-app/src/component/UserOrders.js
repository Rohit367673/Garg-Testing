import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import Footer from "./Footer"
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";

const UserOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/user-orders/${user.id}`, {
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
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="text.primary">
        My Orders
      </Typography>

      {loading && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box textAlign="center" color="error.main" sx={{ py: 4 }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      )}

      {orders.length === 0 && !loading && (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found.
          </Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
                display: "block",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <CardContent>
                <Typography sx={{fontSize:"9px"}} gutterBottom>
                  Order ID: {order._id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: order.orderStatus?.toLowerCase() === "delivered" ? "green" : "text.secondary",
                    mb: 1,
                  }}
                >
                  <strong>Status:</strong> {order.orderStatus}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total:</strong> ₹{order.totalAmount}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Items:
                </Typography>
                {order.cartItems.map((item, index) => (
                  <Box key={index} sx={{ display: "block", alignItems: "center", mb: 2 }}>
                    <CardMedia
                      component="img"
                      image={item.imgsrc}
                      alt={item.productName}
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        objectFit: "cover",
                        borderRadius: 2,
                        mr: 2,
                      }}
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    <Footer/>
    </>
  );
};

export default UserOrders;
