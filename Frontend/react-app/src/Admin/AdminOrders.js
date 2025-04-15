import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handler to update order status
  const handleUpdateOrder = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}`,
        { orderStatus: newStatus }
      );
      console.log("Order updated:", response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleRemoveOrder = async (order) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/orders/${order._id}/complete`);
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/orders/${order._id}`);
      setOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
      console.log("Order moved to history and removed successfully");
    } catch (error) {
      console.error("Error moving order to history:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => {
          const status = order.orderStatus ? order.orderStatus.toLowerCase() : "";
          return (
            <Grid item xs={12} key={order._id}>
              <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Order ID: {order._id}</Typography>
                <Typography variant="body1">
                  <strong>Order Status:</strong> {order.orderStatus}
                </Typography>
                <Typography variant="body1">
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </Typography>
                <Typography variant="body1">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </Typography>

                <Box mt={1}>
                  <Typography variant="subtitle1">Address Details:</Typography>
                  <Typography variant="body2">
                    {order.addressInfo.address}, {order.addressInfo.city},{" "}
                    {order.addressInfo.pincode}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {order.addressInfo.phone}
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography variant="subtitle1">Order Items:</Typography>
                  {order.cartItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      <img
                        src={item.imgsrc}
                        alt={item.productName}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 16,
                        }}
                      />
                      <Box>
                        <Typography variant="body1">
                          <strong>{item.productName}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Price: ₹{item.price}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {item.quantity}
                        </Typography>
                        {item.selectedSize && (
                          <Typography variant="body2">
                            Size: {item.selectedSize}
                          </Typography>
                        )}
                        {item.selectedColor && (
                          <Typography variant="body2">
                            Color: {item.selectedColor}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box mt={2}>
                  {status === "pending" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOrder(order._id, "approved")}
                    >
                      Approve Order
                    </Button>
                  )}
                  {status === "approved" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOrder(order._id, "shipped")}
                    >
                      Order Shipped
                    </Button>
                  )}
                  {status === "shipped" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOrder(order._id, "delivered")}
                    >
                      Order Delivered
                    </Button>
                  )}
                  {status === "delivered" && (
                    <Box>
                      <Typography variant="body1" sx={{ color: "green" }}>
                        Delivered
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 1 }}
                        onClick={() => handleRemoveOrder(order)}
                      >
                        Complete Order
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AdminOrders;
