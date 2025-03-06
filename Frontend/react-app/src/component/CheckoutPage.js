import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { initializeCart } from "../redux/CartSlice.js";
import Footer from "./Footer.js";
import toast from "react-hot-toast";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";

const CheckoutPage = () => {
  const { cartItems, Total, cartId } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize the cart if cartId is not set
  if (!cartId) {
    dispatch(initializeCart());
  }

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to call backend ShipRocket endpoint after order creation
  const initiateShippingOrder = async (orderDetails, method) => {
    try {
      const shippingResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shiprocket/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: orderDetails.cartItems,
            addressInfo: orderDetails.addressInfo,
            totalAmount: orderDetails.totalAmount,
            orderId: orderDetails.orderId,
            paymentMethod: method, // Pass COD/ONLINE flag if needed
          }),
        }
      );
      const shippingData = await shippingResponse.json();
      console.log("Shipping order created:", shippingData);
      toast.success("Shipping order created successfully!");
    } catch (error) {
      console.error("Error creating shipping order:", error);
      toast.error("Error creating shipping order");
    }
  };

  // COD Flow
  const handleCODPayment = async () => {
    if (!user) {
      alert("User is not logged in!");
      navigate("/login");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }
    const userId = user.id;
    const adjustedCartItems = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      imgsrc: item.imgsrc,
      price: item.price,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
    }));
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            cartId,
            cartItems: adjustedCartItems,
            totalAmount: Total,
            paymentMethod: "COD",
            addressInfo: { ...address },
          }),
        }
      );
      const orderData = await response.json();
      if (!orderData.dbOrderId) {
        throw new Error("COD order creation failed");
      }
      await initiateShippingOrder(
        {
          cartItems: adjustedCartItems,
          addressInfo: address,
          totalAmount: Total,
          orderId: orderData.dbOrderId,
        },
        "COD"
      );
      toast.success("COD order placed! Payment will be collected on delivery.");
    } catch (error) {
      alert("Error creating COD order. Please try again.");
      console.error(error);
    }
  };

  // Online Payment Flow with Razorpay
  const handleOnlinePayment = async () => {
    if (!user) {
      alert("User is not logged in!");
      navigate("/login");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }
    const userId = user.id;
    const adjustedCartItems = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      imgsrc: item.imgsrc,
      price: item.price,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
    }));
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            cartId,
            cartItems: adjustedCartItems,
            totalAmount: Total,
            paymentMethod: "Razorpay",
            addressInfo: { ...address },
          }),
        }
      );
      const orderData = await response.json();
      if (!orderData.orderId) {
        throw new Error("Order creation failed");
      }
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderData.amount, // in paise
        currency: "INR",
        order_id: orderData.orderId,
        handler: (razorpayResponse) => {
          alert("Payment successful!");
          console.log("Payment successful!", razorpayResponse);
          initiateShippingOrder(
            {
              cartItems: adjustedCartItems,
              addressInfo: address,
              totalAmount: Total,
              orderId: orderData.orderId,
            },
            "ONLINE"
          );
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#F37254" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Error creating order. Please try again.");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "COD") {
      handleCODPayment();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Checkout
          </Typography>
          {cartItems.length === 0 ? (
            <Typography variant="body1" align="center">
              Your cart is empty. Please add items first.
            </Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Delivery Information */}
                <Grid item xs={12}>
                  <Typography variant="h6">Delivery Information</Typography>
                </Grid>
                {[
                  { label: "Name", name: "name" },
                  { label: "Email", name: "email" },
                  { label: "Phone", name: "phone" },
                  { label: "Street", name: "street" },
                  { label: "City", name: "city" },
                  { label: "Postal Code", name: "postalCode" },
                  { label: "State", name: "state" },
                ].map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={address[field.name]}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                ))}
                {/* Payment Method */}
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <RadioGroup
                      row
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="ONLINE"
                        control={<Radio />}
                        label="Online Payment"
                      />
                      <FormControlLabel
                        value="COD"
                        control={<Radio />}
                        label="Cash on Delivery"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Order Summary</Typography>
                  <Typography variant="body1">Total: ₹{Total}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Place Order
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default CheckoutPage;
