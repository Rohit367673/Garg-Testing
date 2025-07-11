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
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FiPackage, FiCheckCircle, FiClock, FiXCircle, FiUser } from "react-icons/fi";

const statusColors = {
  pending: "#facc15", // yellow
  approved: "#3b82f6", // blue
  shipped: "#fb923c", // orange
  delivered: "#22c55e", // green
  cancelled: "#ef4444", // red
};

const statusIcons = {
  pending: <FiClock className="inline mr-1" />,
  approved: <FiPackage className="inline mr-1" />,
  shipped: <FiPackage className="inline mr-1" />,
  delivered: <FiCheckCircle className="inline mr-1" />,
  cancelled: <FiXCircle className="inline mr-1" />,
};

const UserOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = ["Pending", "Approved", "Shipped", "Delivered"];

  const getActiveStep = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return 0;
      case "approved": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return 0;
    }
  };

  // Order summary counts
  const summary = orders.reduce(
    (acc, order) => {
      const s = order.orderStatus?.toLowerCase();
      acc.total++;
      if (s === "delivered") acc.delivered++;
      else if (s === "pending") acc.pending++;
      else if (s === "cancelled") acc.cancelled++;
      return acc;
    },
    { total: 0, delivered: 0, pending: 0, cancelled: 0 }
  );

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user-orders/${user.id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
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
      <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen pb-12">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* User avatar and summary */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user?.ProfilePic && user.ProfilePic !== 'default-avatar.jpg' ? user.ProfilePic : '/Images/default-avatar.png'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 bg-gray-100"
              />
              <div>
                <div className="font-bold text-lg text-gray-800">{user?.Name || 'User'}</div>
                <div className="text-gray-500 text-sm">{user?.Email || ''}</div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="bg-white rounded-xl shadow px-5 py-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div className="bg-green-50 rounded-xl shadow px-5 py-3 text-center">
                <div className="text-2xl font-bold text-green-600">{summary.delivered}</div>
                <div className="text-xs text-green-700">Delivered</div>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow px-5 py-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
                <div className="text-xs text-yellow-700">Pending</div>
              </div>
              {summary.cancelled > 0 && (
                <div className="bg-red-50 rounded-xl shadow px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.cancelled}</div>
                  <div className="text-xs text-red-700">Cancelled</div>
                </div>
              )}
            </div>
          </div>

          {/* Only show heading if there are orders and no error */}
          {orders.length > 0 && (
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              My Orders
            </Typography>
          )}

          {loading && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Do not show error message to the user */}

          {/* Show empty state only if there are no orders and not loading */}
          {orders.length === 0 && !loading && (
            <Box textAlign="center" sx={{ py: 8 }}>
              <FiPackage className="mx-auto mb-2 text-5xl text-gray-400" />
              <Typography variant="h6" color="text.secondary">
                No orders found.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Looks like you haven&apos;t placed any orders yet.
              </Typography>
              <Link to="/product">
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Shop Now
                </Button>
              </Link>
            </Box>
          )}

          <Grid container spacing={4}>
            {orders.map((order) => {
              const activeStep = getActiveStep(order.orderStatus);
              const status = order.orderStatus?.toLowerCase();
              return (
                <Grid item xs={12} sm={12} md={6} lg={4} key={order._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                      background: '#fff',
                    }}
                  >
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="caption" color="text.secondary">
                          Order ID: {order._id}
                        </Typography>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                          style={{
                            background: statusColors[status] + '22',
                            color: statusColors[status] || '#888',
                          }}
                        >
                          {statusIcons[status]}
                          {order.orderStatus}
                        </span>
                      </div>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Payment Method: {order.paymentMethod}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Payment: {order.paymentStatus}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: ₹{order.totalAmount}
                      </Typography>

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
                              image={item.imgsrc || '/Images/placeholder.png'}
                              alt={item.productName}
                              sx={{
                                width: { xs: 60, sm: 80 },
                                height: { xs: 60, sm: 80 },
                                objectFit: "cover",
                                borderRadius: 2,
                                mr: 2,
                                background: '#f3f3f3',
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
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                          disabled
                        >
                          View Details
                        </Button>
                      </div>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default UserOrders;
