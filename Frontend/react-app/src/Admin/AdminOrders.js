import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Button,
  Grid
} from '@mui/material';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      console.log('Fetching orders')
      const response = await axios.get('http://localhost:3001/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId) => {
    try {
      // We update the order status to "order received" (all lowercase)
      const response = await axios.put(`http://localhost:3001/orders/${orderId}`, { orderStatus: 'order received' });
      console.log('Order updated:', response.data);
      
      // Update the orders in state so that the UI reflects the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: response.data.orderStatus } : order
        )
      );
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => {
          // Normalize order status for comparison
          const status = order.orderStatus ? order.orderStatus.toLowerCase() : '';
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
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </Typography>
                
                <Box mt={1}>
                  <Typography variant="subtitle1">Address Details:</Typography>
                  <Typography variant="body2">
                    {order.addressInfo.address}, {order.addressInfo.city}, {order.addressInfo.pincode}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {order.addressInfo.phone}
                  </Typography>
                </Box>
                
                <Box mt={1}>
                  <Typography variant="subtitle1">Order Items:</Typography>
                  {order.cartItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <img 
                        src={item.imgsrc} 
                        alt={item.productName} 
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16 }} 
                      />
                      <Box>
                        <Typography variant="body1">
                          <strong>{item.productName}</strong>
                        </Typography>
                        <Typography variant="body2">Price: ₹{item.price}</Typography>
                        <Typography variant="body2">Quantity: {item.quantity}</Typography>
                        {item.selectedSize && (
                          <Typography variant="body2">Size: {item.selectedSize}</Typography>
                        )}
                        {item.selectedColor && (
                          <Typography variant="body2">Color: {item.selectedColor}</Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                <Box mt={2}>
                  {status === 'pending' ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleApproveOrder(order._id)}
                    >
                      Approve Order
                    </Button>
                  ) : (
                    <Typography variant="body1" color="green">
                      Order Received
                    </Typography>
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
