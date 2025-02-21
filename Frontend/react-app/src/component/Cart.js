import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  calculatePrice,
  decrement,
  deleteCart,
  increment,
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

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

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
      <Box sx={{ padding: 4, backgroundColor: "#f8f8f8", minHeight: "100vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="text.primary"
        >
          Your Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Your cart is empty.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => (
                <Box
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
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
                    src={item.imgsrc}
                    alt={item.name}
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
                      {item.productName}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {item.price}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.selectedSize}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Color: {item.selectedColor}
                    </Typography>

                    <Typography variant="body1" color="text.primary">
                      Price: ₹{item.price}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        marginTop: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
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
                      sx={{ marginTop: 2 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: "white",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h6" color="text.primary" gutterBottom>
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
                  sx={{ marginTop: 3 }}
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
