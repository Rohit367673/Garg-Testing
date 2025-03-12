import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { initializeCart } from "../redux/CartSlice.js";
import toast from "react-hot-toast";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Box,
  Grow,
  Fade,
} from "@mui/material";
import Footer from "./Footer.js";

const CheckoutPage = () => {
  const { cartItems, Total, cartId } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Shipping and COD fee
  const [shippingCost, setShippingCost] = useState(0);
  const codFee = 50;

  // Calculate total weight (in grams) for shipping calculation
  const totalWeightGrams = cartItems.reduce((sum, item) => {
    const itemWeight = item.weight ? Number(item.weight) : 500; // default
    return sum + itemWeight * item.quantity;
  }, 0);
  const totalWeightKg = totalWeightGrams / 1000;

  // Final total
  const finalTotal = Total + shippingCost + (paymentMethod === "COD" ? codFee : 0);

  // Fetch shipping cost when postal code or cart items change
  useEffect(() => {
    const fetchShippingCost = async () => {
      if (address.postalCode?.length === 6 && cartItems.length > 0) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/shiprocket/calculate-shipping`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                destination_pincode: address.postalCode,
                weight: totalWeightKg,
                cartItems,
              }),
            }
          );
          const data = await response.json();
          if (data.estimated_shipping_cost) {
            setShippingCost(data.estimated_shipping_cost);
          } else {
            setShippingCost(0);
          }
        } catch (error) {
          console.error("Error fetching shipping cost:", error);
          setShippingCost(0);
        }
      }
    };
    fetchShippingCost();
  }, [address.postalCode, cartItems, totalWeightKg]);

  // Handle changes in address fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // OTP: send & verify
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

  // Create shipping order after placing
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

  // COD Payment
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

    try {
      const userId = user.id;
      const adjustedCartItems = cartItems.map((item) => ({
        ...item,
        weight: item.weight || 500,
      }));

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-order`, {
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
      });
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

  // Online Payment
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

    try {
      const userId = user.id;
      const adjustedCartItems = cartItems.map((item) => ({
        ...item,
        weight: item.weight || 500,
      }));

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-order`, {
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
      });
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

  // Form submission
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
    <Grow in timeout={800}>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))",
          }}
        >
          <Fade in timeout={1000}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Checkout
            </Typography>
          </Fade>

          {/** 
           *  Use two columns on md (desktop) and above, 
           *  single column on xs/sm (mobile).
           */}
          <Grid container spacing={4}>
            {/* LEFT COLUMN: Delivery Info, OTP, Payment */}
            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    Delivery Information
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: "Name", name: "name" },
                      { label: "Email", name: "email" },
                      { label: "Phone", name: "phone" },
                      { label: "Street", name: "street" },
                      { label: "City", name: "city" },
                      { label: "Postal Code", name: "postalCode" },
                      { label: "State", name: "state" },
                    ].map((field) => (
                      <Grid item xs={12} md={6} key={field.name}>
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
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    OTP Verification
                  </Typography>
                  <Grid container spacing={2}>
                    {!otpSent ? (
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleSendOTP}
                          fullWidth
                          sx={{ py: 1.5, fontWeight: "bold" }}
                        >
                          Send OTP
                        </Button>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={8}>
                          <TextField
                            fullWidth
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            variant="outlined"
                            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleVerifyOTP}
                            fullWidth
                            sx={{ py: 1.5, fontWeight: "bold" }}
                          >
                            Verify
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    Payment Method
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel value="ONLINE" control={<Radio />} label="Online Payment" />
                      <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* PLACE ORDER BUTTON (visible only on mobile if you want 
                    the user to see it after summary on desktop) */}
                <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={!phoneVerified}
                    sx={{ py: 1.8, fontWeight: "bold" }}
                  >
                    Place Order
                  </Button>
                </Box>
              </form>
            </Grid>

            {/* RIGHT COLUMN: Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Order Summary
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body1">Subtotal:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      ₹{Total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" align="right">
                      ₹{shippingCost}
                    </Typography>
                  </Grid>
                  {paymentMethod === "COD" && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body1">COD Fee:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" align="right">
                          ₹{codFee}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" align="right">
                  Total: ₹{finalTotal}
                </Typography>
              </Paper>

              {/* Place Order Button for DESKTOP (hidden on mobile) */}
              <Box sx={{ display: { xs: "none", md: "block" }, mt: 3 }}>
                <Button
                  type="submit"
                  form="root-form" // or handle differently
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={!phoneVerified}
                  sx={{ py: 1.8, fontWeight: "bold" }}
                  onClick={handleSubmit}
                >
                  Place Order
                </Button>
              </Box>
            </Grid>
          </Grid>

        
        </Paper>
      </Container>
    </Grow>
    <Footer/>
    </>
  );
};

export default CheckoutPage;
