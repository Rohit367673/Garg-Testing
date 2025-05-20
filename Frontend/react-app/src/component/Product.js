import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import "./Product.css";
import Footer from "./Footer";

const Product = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (page = 1, selectedCategory = category) => {
    setIsLoading(true);
    try {
      let response;
      if (query.trim()) {
        response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/search`,
          { params: { query: query.trim() } }
        );
        setProducts(response.data);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
          {
            params: {
              page,
              limit: 16,
              category: selectedCategory === "all" ? "All" : selectedCategory,
            },
          }
        );
        if (page === 1) {
          setProducts(response.data.products);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
        }
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    fetchProducts(1, category);
  }, [category, query, fetchProducts]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, category);
    }
  };

  const handleBuyClick = (product) => {
    if (product && (product._id || product.id)) {
      navigate(`/product/${product._id || product.id}`);
    } else {
      console.error("Product ID is not valid:", product);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <Container className="mt-8">
        <Grid container spacing={2} sx={{ marginBottom: 3, justifyContent: "end" }}>
          {!query.trim() && (
            <Grid item>
              <FormControl variant="outlined" size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Mens">Mens</MenuItem>
                  <MenuItem value="Women">Women</MenuItem>
                  <MenuItem value="Kids">Kids</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item>
            <FormControl variant="outlined" size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="default">Sort by Default</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {isLoading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              {sortedProducts.map((product, index) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      maxWidth: 280,
                      boxShadow: 3,
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.images?.[0]}
                      alt={product.name}
                      sx={{
                        height: { xs: 180, sm: 200, md: 240 },
                        objectFit: "contain",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "12px", sm: "18px" },
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ marginTop: 1 }}
                      >
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

            {!query.trim() && currentPage < totalPages && (
              <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                <Button variant="outlined" onClick={loadMore}>
                  Load More
                </Button>
              </Grid>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Product;
