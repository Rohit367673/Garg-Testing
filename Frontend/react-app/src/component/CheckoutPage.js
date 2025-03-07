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
  Box,
  Grow,
  Fade,
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

  // OTP-related state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to send OTP
  const handleSendOTP = async () => {
    if (!address.phone) {
      toast.error("Please enter a phone number.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+91${address.phone}` }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(data.error || "Error sending OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+91${address.phone}`, code: otp }),
        }
      );
      const data = await res.json();
      if (res.ok && data.status === "approved") {
        toast.success("Phone verified successfully!");
        setPhoneVerified(true);
      } else {
        toast.error("Incorrect OTP or verification failed.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP. Please try again.");
    }
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
            paymentMethod: method,
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
    if (!phoneVerified) {
      toast.error("Please verify your phone number first.");
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
      toast.success(
        "COD order placed! Payment will be collected on delivery."
      );
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
    if (!phoneVerified) {
      toast.error("Please verify your phone number first.");
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

  // Main form submission (decides payment method)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "COD") {
      handleCODPayment();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <Grow in timeout={800}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
          }}
        >
          <Fade in timeout={1000}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
              Checkout
            </Typography>
          </Fade>
          {cartItems.length === 0 ? (
            <Typography variant="body1" align="center">
              Your cart is empty. Please add items first.
            </Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Delivery Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    Delivery Information
                  </Typography>
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
                  <Grid item xs={12} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={address[field.name]}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                    />
                  </Grid>
                ))}

                {/* OTP Section */}
                <Grid item xs={12}>
                  {!otpSent ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSendOTP}
                      fullWidth
                      sx={{ py: 1.5, fontWeight: "bold" }}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1, backgroundColor: "#fff", borderRadius: 1 }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleVerifyOTP}
                        fullWidth
                        sx={{ py: 1.5, fontWeight: "bold" }}
                      >
                        Verify OTP
                      </Button>
                    </>
                  )}
                </Grid>

                {/* Payment Method */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1 }}>
                      Payment Method
                    </FormLabel>
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
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Order Summary
                  </Typography>
                  <Typography variant="body1">Total: ₹{Total}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={!phoneVerified}
                    sx={{ py: 1.8, fontWeight: "bold", mt: 1 }}
                  >
                    Place Order
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Container>
    </Grow>
  );
};

export default CheckoutPage;
