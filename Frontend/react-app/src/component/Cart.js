// src/component/Cart.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  calculatePrice,
  decrement,
  deleteCart,
  increment,
} from "../redux/CartSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Paper,
  Select,
  MenuItem,
  Link,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "./Footer";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal, Total } = useSelector((state) => state.cart);

  // Recalculate price any time cartItems changes
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  // Fetch related products (limit 4)
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products?limit=4`
        );
        setRelatedProducts(response.data.products || response.data || []);
      } catch (error) {
        console.error("Error fetching related products:", error.message);
      }
    };
    fetchRelatedProducts();
  }, []);

  // Handlers
  const handleDelete = (id, selectedSize, selectedColor) => {
    dispatch(deleteCart({ id, selectedSize, selectedColor }));
  };

  const handleDecrement = (id, selectedSize, selectedColor) => {
    dispatch(decrement({ id, selectedSize, selectedColor }));
  };

  const handleIncrement = (id, selectedSize, selectedColor) => {
    const item = cartItems.find(
      (it) =>
        it.id === id &&
        it.selectedSize === selectedSize &&
        it.selectedColor === selectedColor
    );
    if (item && item.quantity < 2) {
      dispatch(increment({ id, selectedSize, selectedColor }));
    } else {
      toast.error("Maximum quantity reached!");
    }
  };

  const handleQtyChange = (e, id, selectedSize, selectedColor) => {
    const newQty = parseInt(e.target.value, 10);
    const item = cartItems.find(
      (it) =>
        it.id === id &&
        it.selectedSize === selectedSize &&
        it.selectedColor === selectedColor
    );
    if (!item) return;
    if (newQty > item.quantity) {
      for (let i = item.quantity; i < newQty; i++) {
        handleIncrement(id, selectedSize, selectedColor);
      }
    } else if (newQty < item.quantity) {
      for (let i = item.quantity; i > newQty; i--) {
        handleDecrement(id, selectedSize, selectedColor);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      toast.error("Your cart is empty!");
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/product/${relatedProductId}`);
  };

  // Check mobile
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f2f2f2",
          minHeight: "100vh",
          pb: isXs ? "80px" : 0, 
          px: { xs: 0, sm: 2, md: 4 },        // ← Remove horizontal padding on xs
        }}
      >
        <Box sx={{ pt: { xs: 1, sm: 2, md: 4 } }}>
          {/* Page Heading */}
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Shopping Cart
          </Typography>

          {cartItems.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 4 }}
            >
              Your Cart is Empty
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {/* ===== Cart Items (takes full width on xs, 8/12 on md+) ===== */}
              <Grid item xs={12} md={8}>
                {cartItems.map((item) => {
                  const key = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
                  return (
                    <Paper
                      key={key}
                      elevation={1}
                      sx={{
                        width: { xs: "200%", sm: "100%" },
                        display: "flex",
                        flexDirection: "row",            // ← Always row: image on left, details on right
                        bgcolor: "#fff",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        
                      }}
                    >
                      {/* LEFT: Product Image (fixed 100×100) */}
                      <Box
                        component="img"
                        src={item.imgsrc}
                        alt={item.productName}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                          mr: 2,
                        }}
                      />

                      {/* RIGHT: Details & Actions in a vertical stack */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Top: Name + Seller */}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, lineHeight: 1.2 }}
                          >
                            {item.productName}
                          </Typography>
                 
                        </Box>

                        {/* Middle: Price, Size, Color Circle */}
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            ₹{item.price}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Size: {item.selectedSize}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Color:
                            </Typography>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: item.selectedColor,
                                border: "1px solid #ccc",
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Bottom: Qty + Delete/Save */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          {/* Quantity Dropdown */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2">Qty:</Typography>
                            <Select
                              size="small"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQtyChange(
                                  e,
                                  item.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              sx={{
                                width: 60,
                                height: 32,
                                fontSize: "0.9rem",
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((qty) => (
                                <MenuItem key={qty} value={qty}>
                                  {qty}
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>

                          {/* Delete & Save Links */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDelete(
                                  item.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                       
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Grid>

              {/* ===== Summary (4-column on md+, hidden on xs) ===== */}
              <Grid item xs={12} md={4}>
                {!isXs && (
                  <Paper
                    elevation={1}
                    sx={{
                      bgcolor: "#fff",
                      p: 3,
                      borderRadius: 1,
                      position: "sticky",
                      top: 16,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      Order Summary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Subtotal</Typography>
                      <Typography variant="body2">₹{subTotal}</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Total
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        ₹{Total}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                      onClick={handleCheckout}
                    >
                      Proceed to Buy
                    </Button>
                  </Paper>
                )}
              </Grid>
            </Grid>
          )}

          {/* ===== Discover More Products ===== */}
          <Box sx={{ mt: 4, px: { xs: 0, sm: 2, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Discover More Products
            </Typography>
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 1,
                py: 1,
              }}
            >
              {relatedProducts.length === 0 ? (
                <Typography variant="body2">
                  Loading related products...
                </Typography>
              ) : (
                relatedProducts.map((prod) => (
                  <Paper
                    key={prod._id || prod.id}
                    elevation={1}
                    sx={{
                      flexShrink: 0,
                      width: 160,
                      borderRadius: 1,
                      p: 1,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                    onClick={() =>
                      handleRelatedProductClick(prod._id || prod.id)
                    }
                  >
                    <Box
                      component="img"
                      src={prod.images?.[0] || "placeholder.jpg"}
                      alt={prod.name}
                      sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "contain",
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                      noWrap
                    >
                      {prod.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{prod.price}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        mt: 0.5,
                        textTransform: "none",
                        fontSize: "0.75rem",
                      }}
                    >
                      View
                    </Button>
                  </Paper>
                ))
              )}
            </Box>
          </Box>
        </Box>

        {/* ===== Mobile Sticky Summary ===== */}
        {cartItems.length > 0 && isXs && (
          <Paper
            elevation={4}
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "#fff",
              borderTop: "1px solid #ddd",
              px: 2,
              py: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Subtotal: ₹{subTotal}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({cartItems.reduce((sum, it) => sum + it.quantity, 0)} items)
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontSize: "0.9rem",
                  ml: 1,
                }}
                onClick={handleCheckout}
              >
                Proceed to Buy
              </Button>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Cart;
