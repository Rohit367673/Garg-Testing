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
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import "./Product.css";
import Footer from "./Footer";

const Product = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchMessage, setSearchMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [sort, setSort] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event).key === 'Tab' || (event).key === 'Shift')
    ) {
      return;
    }
    setFilterDrawerOpen(open);
  };

  const fetchProducts = useCallback(
    async (page = 1, selectedCategory = category, selectedType = productType) => {
      setIsLoading(true);
      try {
        let response;

        if (query.trim()) {
          response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/search`, {
            params: {
              query: query.trim(),
              category: selectedCategory === "all" ? undefined : selectedCategory,
              productType: selectedType === "all" ? undefined : selectedType,
            },
          });

          setProducts(Array.isArray(response.data) ? response.data : []);
          setPopularProducts([]);
          setSearchMessage(null);
          setCurrentPage(1);
          setTotalPages(1);
        } else {
          // Build filter params
          const params = {
            page,
            limit: 16
          };

          // Only add filters if they are not "all"
          if (selectedCategory !== "all") {
            params.category = selectedCategory;
          }
          if (selectedType !== "all") {
            params.productType = selectedType;
          }

          console.log('Sending filter params:', {
            category: selectedCategory,
            productType: selectedType,
            params
          });

          response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
            params,
          });

          console.log('Received products:', response.data.products.length);

          if (page === 1) {
            setProducts(response.data.products);
          } else {
            setProducts((prev) => [...prev, ...response.data.products]);
          }
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
          setPopularProducts([]);
          setSearchMessage(null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setSearchMessage("Error loading products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [category, productType, query]
  );

  // Reset products when filters change
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    fetchProducts(1, category, productType);
  }, [category, productType, query, fetchProducts]);

  // Add effect to log filter changes
  useEffect(() => {
    console.log('Filter state changed:', { category, productType });
  }, [category, productType]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, category, productType);
    }
  };

  const handleBuyClick = (product) => {
    if (product && (product._id || product.id)) {
      navigate(`/product/${product._id || product.id}`);
    } else {
      console.error("Invalid Product ID:", product);
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
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={toggleDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          </Box>
        )}

        {!isMobile && (
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              marginBottom: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2
            }}
          >
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
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
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Product Type</InputLabel>
                <Select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  label="Product Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Formal">Formal</MenuItem>
                  <MenuItem value="Traditional">Traditional</MenuItem>
                  <MenuItem value="Party Wear">Party Wear</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                  <MenuItem value="Winter">Winter</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth variant="outlined" size="small">
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
        )}

        <Drawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>Filter Options</Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
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
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Product Type</InputLabel>
              <Select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                label="Product Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Formal">Formal</MenuItem>
                <MenuItem value="Traditional">Traditional</MenuItem>
                <MenuItem value="Party Wear">Party Wear</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" onClick={toggleDrawer(false)}>Close</Button>
             </Box>
          </Box>
        </Drawer>

        {isLoading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            {searchMessage && (
              <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
                {searchMessage}
              </Typography>
            )}

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
                      sx={{ height: 220, objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography variant="h6" color="primary" mt={1}>
                        ₹{product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
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
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
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
