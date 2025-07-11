import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, calculatePrice } from "../redux/CartSlice";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Fade,
  Rating,
  TextField,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  // Review states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const availableSizes   = product?.size    || [];
const unavailableSizes = product?.outSizes || [];

const availableColors   = product?.color    ?.map(c => c.trim()) || [];
const unavailableColors = product?.outColors?.map(c => c.trim()) || [];

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };
    fetchProduct();
    setCurrentImageIndex(0);
  }, [productId]);

  // Fetch related products based on category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product?.Catagory) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/products?category=${product.Catagory}`
          );
          setRelatedProducts(response.data.products || []);
        } catch (error) {
          console.error("Error fetching related products:", error.message);
          setRelatedProducts([]);
        }
      }
    };
    fetchRelatedProducts();
  }, [product]);

  // Fetch reviews for the current product
  useEffect(() => {
    const fetchReviews = async () => {
      if (product?._id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/reviews/${product._id}`
          );
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews:", error.message);
        }
      }
    };
    if (product) {
      fetchReviews();
    }
  }, [product]);

  // Add product to cart
  const addToCartHandler = async () => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      navigate("/Login");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.");
      return;
    }
    const cartItem = {
      userId: user.id,
      productId: product._id,
      productName: product.name,
      imgsrc: product.images?.[0] || "placeholder.jpg",
      price: product.price,
      quantity: 1,
      selectedSize,
      selectedColor,
    };
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addCart`, cartItem, {
        headers: { "Content-Type": "application/json" },
      });
      dispatch(addToCart(cartItem));
      dispatch(calculatePrice());
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding the product to the cart.");
    }
  };

  // For demonstration: handle a purchase that reduces stock by a given quantity
  const handlePurchase = async (purchaseQty) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/purchase`, {
        productId: product._id,
        purchaseQty,
      });
      setProduct((prev) => ({
        ...prev,
        quantity: response.data.newQuantity,
      }));
      toast.success("Purchase successful!");
    } catch (error) {
      console.error("Error during purchase:", error.response?.data.error || error.message);
      toast.error(error.response?.data.error || "Purchase failed");
    }
  };

  // Image slider navigation
  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev + 1 < product.images.length ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : product.images.length - 1
      );
    }
  };

  // Handle click on a related product
  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/product/${relatedProductId}`);
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    const reviewData = {
      productId: product._id,
      userId: user.id,
      rating,
      review: reviewText,
      createdAt: new Date().toISOString(),
    };
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`, reviewData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      // Refresh the reviews list
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${product._id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting your review.");
    }
  };

  // Render product image slider
  const renderSlider = (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: isDesktop ? 0 : 3,
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.7)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
        }}
        onClick={prevImage}
      >
        <ArrowBackIosIcon sx={{ color: "black" }} />
      </IconButton>

      <Fade in timeout={500}>
        <Box
          component="img"
          src={product?.images?.[currentImageIndex] || "placeholder.jpg"}
          alt={product?.name}
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
            boxShadow: 3,
            height: { xs: "20rem", sm: "25rem" },
            objectFit: "contain",
          }}
        />
      </Fade>

      <IconButton
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.7)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
        }}
        onClick={nextImage}
      >
        <ArrowForwardIosIcon sx={{ color: "black" }} />
      </IconButton>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {product?.images?.map((img, idx) => (
          <Box
            key={idx}
            component="img"
            src={img}
            alt={`Thumbnail ${idx}`}
            onClick={() => setCurrentImageIndex(idx)}
            sx={{
              width: 50,
              height: 50,
              mx: 0.5,
              borderRadius: 1,
              cursor: "pointer",
              border: currentImageIndex === idx ? "2px solid #007bff" : "2px solid transparent",
              transition: "border-color 0.3s ease",
              objectFit: "contain",
            }}
          />
        ))}
      </Box>
    </Box>
  );

  // Render product details (including dynamic stock display)
  const renderDetails = (
    <Box
      sx={{
        maxWidth: isDesktop ? "100%" : 500,
        mx: isDesktop ? 0 : "auto",
        p: isDesktop ? 3 : 0,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {product?.name}
      </Typography>
      <Typography variant="h6" sx={{ color: "#007bff", mb: 1 }}>
       <strong>Price:</strong>  ₹{product?.price}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        {product?.description}
      </Typography>
      <Typography variant="h6" sx={{ color: "#007bff", mb: 1 }}>
       <strong>Brand:</strong>  {product?.brand}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
  <strong>Stock:</strong> {product?.quantity > 0 ? "In Stock" : "Out Of Stock"}
</Typography>

      {/* Size Selection */}
{(availableSizes.length || unavailableSizes.length) > 0 && (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Select Size:
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {availableSizes.map((sz) => (
        <Button
          key={sz}
          size="small"
          variant={selectedSize === sz ? "contained" : "outlined"}
          sx={{
            backgroundColor: selectedSize === sz ? '#333' : '#fff',
            color: selectedSize === sz ? '#fff' : '#222',
            borderColor: '#333',
            '&:hover': { backgroundColor: '#333', color: '#fff' },
            fontWeight: 600,
          }}
          onClick={() => setSelectedSize(sz)}
        >
          {sz.toUpperCase()}
        </Button>
      ))}

      {unavailableSizes.map((sz) => (
        <Button
          key={sz}
          size="small"
          variant="outlined"
          disabled
          sx={{
            color: '#999',
            textDecoration: 'line-through',
            borderColor: '#ccc',
            backgroundColor: '#f5f5f5',
          }}
        >
          {sz.toUpperCase()}
        </Button>
      ))}
    </Box>
  </Box>
)}

{/* Color Selection */}
{(availableColors.length || unavailableColors.length) > 0 && (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Select Color:
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {availableColors.map((c) => (
        <Box
          key={c}
          onClick={() => setSelectedColor(c)}
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: c,
            border: selectedColor === c ? '2px solid #333' : '1px solid #ccc',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.1)', border: '2px solid #333' },
          }}
        />
      ))}

      {unavailableColors.map((c) => (
        <Box
          key={c}
          sx={{
            position: "relative",
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: c,
            opacity: 0.4,
            border: "1px solid #ccc",
            cursor: "not-allowed",
            // a little "slash" to mimic the strikethrough:
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              width: "2px",
              height: "100%",
              backgroundColor: "#666",
              transform: "rotate(45deg) translateX(-50%)",
            },
          }}
        />
      ))}
    </Box>
  </Box>
)}
<Button
  variant="contained"
  sx={{
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    mb: 1,
    '&:hover': { backgroundColor: '#555', color: '#fff' },
    fontWeight: 700,
    fontSize: '1.1rem',
    borderRadius: 2,
  }}
  disabled={product?.quantity <= 0}
  onClick={() => {
    if (product?.quantity > 0) {
      addToCartHandler();
    } else {
      toast.error('Out of stock');
    }
  }}
>
  ADD TO CART
</Button>
      <Link to="/cart" style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          sx={{
            width: '100%',
            backgroundColor: '#333',
            color: '#fff',
            '&:hover': { backgroundColor: '#555', color: '#fff' },
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          CHECK-OUT
        </Button>
      </Link>
     
     
    </Box>
  );

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
        {product && (
          <>
            {isDesktop ? (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  {renderSlider}
                </Grid>
                <Grid item xs={12} md={6}>
                  {renderDetails}
                </Grid>
              </Grid>
            ) : (
              <>
                {renderSlider}
                {renderDetails}
              </>
            )}

            {/* Similar Products Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Similar Products
              </Typography>
              <Box sx={{ display: "flex", overflowX: "auto", gap: 2, py: 1 }}>
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
                      onClick={() => handleRelatedProductClick(item._id || item.id)}
                    >
                      <Box
                        component="img"
                        src={item.images?.[0] || "placeholder.jpg"}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: 150,
                          borderRadius: 1,
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: "center", color: "#333" }}>
                        ₹{item.price}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          width: "100%",
                          mt: 1,
                          backgroundColor: "#007bff",
                          "&:hover": { backgroundColor: "#555" },
                        }}
                      >
                        Show Product
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {/* Reviews Section */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                maxWidth: "100%",
                mx: "auto",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Product Reviews
              </Typography>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <Box key={rev._id} sx={{ borderBottom: "1px solid #ddd", py: 1 }}>
                    <Typography variant="subtitle2">
                      {rev.userId?.Name || "Anonymous"}
                    </Typography>
                    <Rating value={rev.rating} readOnly size="small" />
                    <Typography variant="body2">{rev.review}</Typography>
                    <Typography variant="caption">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No reviews yet. Be the first to review this product.</Typography>
              )}
              {user ? (
                <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Leave a Review
                  </Typography>
                  <Rating
                    name="product-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                  />
                  <TextField
                    label="Your Review"
                    multiline
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                  <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit Review
                  </Button>
                </Box>
              ) : (
                <Typography sx={{ mt: 2 }}>Please log in to leave a review.</Typography>
              )}
            </Box>
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default ProductDetails;
