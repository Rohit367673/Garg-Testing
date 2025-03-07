import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  calculatePrice,
  decrement,
  deleteCart,
  increment,
  setShipping, // Assume you have an action to update shipping cost in Redux
} from "../redux/CartSlice";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "./Footer";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal, shipping, Total } = useSelector(
    (state) => state.cart
  );
  const [destinationPincode, setDestinationPincode] = useState("");

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  // Example function to calculate shipping
  const fetchShippingCost = async () => {
    try {
      // Example: Calculate total weight from cart items (adjust logic as needed)
      const totalWeight = cartItems.reduce(
        (acc, item) => acc + item.weight * item.quantity,
        0
      );
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/shiprocket/calculate-shipping`, {
        weight: totalWeight,
        destination_pincode: destinationPincode,
      });
      // Assuming response.data contains the shipping cost in a field, e.g., shipping_charge
      dispatch(setShipping(response.data.data.shipping_charge));
    } catch (error) {
      console.error("Error fetching shipping cost:", error);
    }
  };

  // Call fetchShippingCost when destination pincode or cart items change
  useEffect(() => {
    if (destinationPincode) {
      fetchShippingCost();
    }
  }, [destinationPincode, cartItems]);

  const handleDelete = (id, selectedSize, selectedColor) => {
    dispatch(deleteCart({ id, selectedSize, selectedColor }));
  };

  const handleDecrement = (id, selectedSize, selectedColor) => {
    dispatch(decrement({ id, selectedSize, selectedColor }));
  };

  const handleIncrement = (id, selectedSize, selectedColor) => {
    dispatch(increment({ id, selectedSize, selectedColor }));
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      alert("Your cart is empty!");
    }
  };

  return (
    <>
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          backgroundColor: "#f8f8f8",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="text.primary"
          sx={{ fontWeight: "bold" }}
        >
          Cart
        </Typography>

        {/* Example input to capture pincode */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <input
            type="text"
            placeholder="Enter Delivery Pincode"
            value={destinationPincode}
            onChange={(e) => setDestinationPincode(e.target.value)}
          />
          <Button onClick={fetchShippingCost}>Calculate Shipping</Button>
        </Box>

        {cartItems.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Your cart is empty.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {/* Product List Section */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                "@media (max-width: 768px)": {
                  flex: "0 0 100% !important",
                  maxWidth: "100% !important",
                },
              }}
            >
              {cartItems.map((item) => (
                <Box
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  sx={{
                    maxWidth: { xs: "90%", sm: "100%", md: "70%" },
                    margin: "0 auto",
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    marginBottom: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={item.imgsrc}
                    alt={item.name}
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 2,
                      marginRight: { xs: 0, sm: 2 },
                      marginBottom: { xs: 2, sm: 0 },
                    }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="text.primary">
                      {item.productName}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginTop: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleDecrement(
                            item.id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        -
                      </Button>
                      <Typography variant="body1">{item.quantity}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleIncrement(
                            item.id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        +
                      </Button>
                    </Box>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(
                          item.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      sx={{ marginTop: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Summary Section */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                "@media (max-width: 768px)": {
                  flex: "0 0 100% !important",
                  maxWidth: "100% !important",
                },
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: "90%", sm: "80%", md: "100%" },
                  margin: "0 auto",
                  backgroundColor: "white",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="h6"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Summary
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Subtotal: ₹{subTotal}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Shipping: ₹{shipping}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ marginTop: 2 }}
                >
                  Total: ₹{Total}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 3, width: "100%" }}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Cart;
