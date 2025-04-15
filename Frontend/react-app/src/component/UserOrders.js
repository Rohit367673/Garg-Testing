import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import Footer from "./Footer";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Card,
  CardContent,
  CardMedia,
  Divider,
  GlobalStyles,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Link } from "react-router-dom";

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

  // Define the order progress steps
  const steps = ["Pending", "Approved", "Shipped", "Delivered"];

  const getActiveStep = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "approved":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@media (max-width:768px)": {
            ".MuiGrid-item": {
              flex: "0 0 100% !important",
              maxWidth: "100% !important",
            },
          },
        }}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          My Orders
        </Typography>

        {loading && (
          <Box textAlign="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box textAlign="center" sx={{ py: 4 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
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
          {orders.map((order) => {
            const activeStep = getActiveStep(order.orderStatus);
            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={order._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Order ID: {order._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        color:
                          order.orderStatus?.toLowerCase() === "delivered"
                            ? "green"
                            : "text.secondary",
                        mb: 1,
                      }}
                    >
                      Status: {order.orderStatus}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {/* Show Payment Method */}
                    <Typography variant="body2" color="text.secondary">
                      Payment Method: {order.paymentMethod}
                    </Typography>
                    {/* Optionally show Payment Status if needed */}
                    <Typography variant="body2" color="text.secondary">
                      Payment: {order.paymentStatus}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: ₹{order.totalAmount}
                    </Typography>

                    {/* Order progress line */}
                    <Box mt={2}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Items:
                    </Typography>
                    {order.cartItems.map((item, index) => (
                      <Link
                        key={index}
                        to={`/product/${item.productId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: "grey.100",
                          }}
                        >
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
                              Qty: {item.quantity}
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
                      </Link>
                    ))}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default UserOrders;
