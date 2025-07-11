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
import { motion } from "framer-motion";
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
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 90,
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FilterListIcon sx={{ mr: 1, color: '#333' }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Filters
                    </Typography>
                  </Box>
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
                    onClick={() => {
                      setCategory('all');
                      setProductType('all');
                      setSort('default');
                    }}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              {/* Product grid and rest of the page */}
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
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.08 }}
                          whileHover={{ scale: 1.045, boxShadow: "0 8px 32px rgba(191,167,106,0.18)" }}
                          style={{ width: "100%", maxWidth: 280 }}
                        >
                          <Card
                            sx={{
                              width: "100%",
                              maxWidth: 280,
                              boxShadow: 3,
                              borderRadius: 2,
                              transition: "box-shadow 0.3s, transform 0.3s",
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
                              <Typography variant="h6" sx={{ color: '#222', fontWeight: 700, mt: 1 }}>
                                ₹{product.price}
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, backgroundColor: '#222', color: '#fff', borderRadius: 2, fontWeight: 600, '&:hover': { backgroundColor: '#555', color: '#fff' } }}
                                onClick={() => handleBuyClick(product)}
                              >
                                Buy Now
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {!query.trim() && currentPage < totalPages && (
                    <Grid container justifyContent="center" sx={{ mt: 3 }}>
                      <Button variant="outlined" sx={{ color: '#333', borderColor: '#333', fontWeight: 600, '&:hover': { backgroundColor: '#333', color: '#fff', borderColor: '#333' } }} onClick={loadMore}>
                        Load More
                      </Button>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Product;
