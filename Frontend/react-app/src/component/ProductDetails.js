import React, { useState, useEffect,useContext } from "react";
import { useParams,Link} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, calculatePrice } from "../redux/CartSlice";
import axios from "axios";
import { Box, Button, Grid, Typography, IconButton, Fade } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AuthContext } from "./AuthContext";

const ProductDetails = () => {
  const { productId } = useParams();
     const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { cartItems } = useSelector((state) => state.cart);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product?.category) {
        try {
          const response = await axios.get(`http://localhost:3001/api/products?category=${product.category}`);
          setRelatedProducts(response.data);
        } catch (error) {
          console.error("Error fetching related products:", error.message);
        }
      }
    };
    fetchRelatedProducts();
  }, [product]);

  const addToCartHandler = async () => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      return;
    }
  
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.");
      return;
    }
  
    const currentUserId = user.id; // Now safe since we checked if user exists
  
    const cartItem = {
      userId: currentUserId, 
      productId: product._id, 
      productName: product.name, 
      imgsrc: product.images?.[0]
        ? `http://localhost:3001/uploads/${product.images[0]}`
        : "placeholder.jpg",
      price: product.price,
      quantity: 1,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
    };
  
    try {
      await axios.post("http://localhost:3001/addCart", cartItem, {
        headers: { "Content-Type": "application/json" },
      });
  
      dispatch(addToCart(cartItem));
      dispatch(calculatePrice());
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("There was an error adding the product to the cart.");
    }
  };
  
  // Image Slider Navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1 < product.images.length ? prevIndex + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 >= 0 ? prevIndex - 1 : product.images.length - 1));
  };

  // Handle related product click
  const handleRelatedProductClick = async (relatedProductId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/${relatedProductId}`);
      setProduct(response.data);
      window.scrollTo(0, 0);  // Optional: to scroll to the top when the product changes
    } catch (error) {
      console.error("Error fetching related product:", error.message);
    }
  };

  return (
    <>
      <Box sx={{ padding: "2rem" }}>
        {product && (
          <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <IconButton
                  sx={{ position: "absolute", top: "50%", left: 0, zIndex: 1 }}
                  onClick={prevImage}
                >
                  <ArrowBackIosIcon sx={{ color: "white" }} />
                </IconButton>

                <Fade in={true} timeout={500}>
                  <img
                    src={`http://localhost:3001/uploads/${product.images[currentImageIndex]}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      height: "28rem",
                      objectFit: "contain",
                    }}
                  />
                </Fade>

                <IconButton
                  sx={{ position: "absolute", top: "50%", right: 0, zIndex: 1 }}
                  onClick={nextImage}
                >
                  <ArrowForwardIosIcon sx={{ color: "white" }} />
                </IconButton>

                {/* Thumbnails */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/uploads/${image}`}
                      alt={`Thumbnail ${image}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        margin: "0 5px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        border: currentImageIndex === index ? "2px solid #007bff" : "2px solid transparent",
                        transition: "border-color 0.3s ease",
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ paddingLeft: "2rem" }}>
                <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
                  {product.name}
                </Typography>
                <Typography variant="h6" sx={{ color: "#007bff", marginBottom: "1rem" }}>
                  ₹{product.price}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "1.5rem" }}>
                  {product.description}
                </Typography>
                <Typography sx={{ marginTop: "1rem" }}><strong>Stock:</strong> {product.stock}</Typography>

                {/* Size Selection */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1rem" }}>
                  <Typography>Select Size:</Typography>
                  {product.size?.[0]?.split(",").map((size, index) => (
                    <Button
                      key={index}
                      sx={{
                        background: selectedSize === size ? "#007bff" : "#f5f5f5",
                        color: selectedSize === size ? "white" : "black",
                        "&:hover": { background: "#007bff", color: "white" },
                      }}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.toUpperCase()}
                    </Button>
                  ))}
                </Box>

                {/* Color Selection */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Typography>Select Color:</Typography>
                  {product.color?.[0]?.split(",").map((color, index) => (
                    <Box
                      key={index}
                      sx={{
                        
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        backgroundColor: color.trim(),
                        border: selectedColor === color.trim() ? "2px solid black" : "1px solid black",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.2)" },
                      }}
                      onClick={() => setSelectedColor(color.trim())}
                    />
                  ))}
                </Box>

                <Button
                  sx={{ marginTop: "1rem", padding: "10px 20px", background: "#000", color: "white", "&:hover": { background: "#e60023" } }}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
                <Link to="/cart">
                <Button
                  sx={{ marginTop: "1rem",marginLeft:"1rem", padding: "10px 20px", background: "#000", color: "white", "&:hover": { background: "#e60023" } }}
                  
                >
                 Check-Out
                </Button>
                </Link>
           
              
                
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Related Products */}
        <Typography variant="h5" sx={{ marginTop: "3rem", marginBottom: "1rem" }}>
          Similar Products
        </Typography>
        <Box sx={{ display: "flex", overflowX: "auto", gap: "15px", padding: "1rem" }}>
          {relatedProducts.length === 0 ? (
            <Typography>Loading related products...</Typography>
          ) : (
            relatedProducts.map((item) => (
              <Box
                key={item._id || item.id}
                sx={{
                  flexShrink: 0,
                  width: "200px",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  gap: "2rem",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={item.images?.[0] ? `http://localhost:3001/uploads/${item.images[0]}` : "placeholder.jpg"}
                  alt={item.name}
                  style={{ width: "100%", height: "15rem", borderRadius: "8px",objectFit:"contain", }}
                />
                <Typography variant="body2" sx={{ marginTop: "1rem", textAlign: "center" }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", color: "#333" }}>
                  ₹{item.price}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    marginTop: "1rem",
                    backgroundColor: "#007bff",
                    "&:hover": { backgroundColor: "#0056b3" },
                  }}
                  onClick={() => handleRelatedProductClick(item._id || item.id)}
                >
                  Show Product
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ProductDetails;
