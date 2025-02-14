import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./Product.css"
import Footer from "./Footer";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Filter and sort products
  const filteredProducts = products.filter((product) =>
    category === "all" || product.category === category
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    return 0;
  });

  const handleBuyClick = (product) => {
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    } else {
      console.error("Product ID is not valid:", product);
    }
  };

  return (
    <>
    <Container className="mt-8">
      {/* Filter & Sort Controls */}
      <Grid container spacing={2} sx={{ marginBottom: 3, justifyContent: "end", }}>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Mens">Mens</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} label="Sort By">
              <MenuItem value="default">Sort by Default</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Product List */}
      <Grid container spacing={3}>
        {sortedProducts.slice(0, visibleProducts).map((product,index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 300, boxShadow: 3, borderRadius: 2 ,}}>
              <CardMedia
              className="h-60 object-contain "
                component="img"
                
                image={`http://localhost:3001/uploads/${product.images?.[0]}`}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ⭐⭐⭐⭐⭐
                </Typography>
                <Typography variant="h6" color="primary" sx={{ marginTop: 1 }}>
                  {product.price} Rs
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={() => handleBuyClick(product)}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {visibleProducts < sortedProducts.length && (
        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Button variant="outlined" onClick={() => setVisibleProducts(visibleProducts + 8)}>
            Load More
          </Button>
        </Grid>
      )}
    </Container>
    <Footer/>
    </>
  );
};

export default Product;