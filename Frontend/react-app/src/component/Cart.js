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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "./Footer";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal, Total } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  // Fetch some products (not based on category)
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products?limit=4`
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error.message);
      }
    };
    fetchRelatedProducts();
  }, []);

  const handleDelete = (id, selectedSize, selectedColor) => {
    dispatch(deleteCart({ id, selectedSize, selectedColor }));
  };

  const handleDecrement = (id, selectedSize, selectedColor) => {
    dispatch(decrement({ id, selectedSize, selectedColor }));
  };

  // Updated handleIncrement function to check current quantity
  const handleIncrement = (id, selectedSize, selectedColor) => {
    const item = cartItems.find(
      (item) =>
        item.id === id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    if (item && item.quantity < 2) {
      dispatch(increment({ id, selectedSize, selectedColor }));
    } else {
      toast.error("Maximum quantity reached!");
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
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Your cart is empty.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items Section */}
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => (
                <Box
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={item.imgsrc}
                    alt={item.name}
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: "auto",
                      borderRadius: 2,
                      marginRight: { xs: 0, sm: 2 },
                      marginBottom: { xs: 2, sm: 0 },
                      objectFit: "cover",
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
                        disabled={item.quantity >= 2}
                      >
                        +
                      </Button>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(item.id, item.selectedSize, item.selectedColor)
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
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: "white",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Summary
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Subtotal: ₹{subTotal}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="text.primary">
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

        {/* Discover Other Products Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Discover More Products
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              py: 1,
            }}
          >
            {relatedProducts.length === 0 ? (
              <Typography>Loading related products...</Typography>
            ) : (
              relatedProducts.map((item) => (
                <Box
                  key={item._id || item.id}
                  sx={{
                    flexShrink: 0,
                    width: 200,
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 2,
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  onClick={() =>
                    handleRelatedProductClick(item._id || item.id)
                  }
                >
                  <Box
                    component="img"
                    src={
                      item.images?.[0]
                        ? item.images[0]
                        : "placeholder.jpg"
                    }
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: 150,
                      borderRadius: 1,
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", color: "#333" }}
                  >
                    ₹{item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      mt: 1,
                      backgroundColor: "#007bff",
                      "&:hover": { backgroundColor: "#ff6347" },
                    }}
                  >
                    Show Product
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Cart;
