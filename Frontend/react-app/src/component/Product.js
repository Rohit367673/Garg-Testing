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
import Home from './Home'; // for card style reference

// Compact ProductCard (copied from Home.js, slightly adapted for Product page)
const ProductCard = ({ product, onClick }) => (
  <div style={{ position: 'relative', height: '100%' }}>
    {product.oldPrice && product.oldPrice > product.price && (
      <div style={{
        position: 'absolute',
        top: 6,
        left: 6,
        background: '#333',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.7rem',
        borderRadius: 5,
        padding: '0.15em 0.5em',
        zIndex: 2,
        boxShadow: '0 1px 4px rgba(51,51,51,0.12)'
      }}>
        {Math.round(100 - (product.price / product.oldPrice) * 100)}% OFF
      </div>
    )}
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 2px 12px rgba(34,34,34,0.08)',
      p: 2.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.15s',
      minHeight: { xs: 160, sm: 180, md: 200 },
      '&:hover': {
        transform: 'translateY(-2px) scale(1.01)',
        boxShadow: '0 3px 12px rgba(51,51,51,0.12)',
      },
    }}>
      <div style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || '/Images/placeholder.png'}
          alt={product.name}
          sx={{
            height: { xs: 140, sm: 180, md: 220 },
            objectFit: 'cover',
            background: '#faf9f6',
            borderRadius: 2,
          }}
        />
      </div>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        pb: 0.25,
        px: 0.25,
        pt: 0.25,
        gap: 0.25,
        '&:last-child': { pb: 0.25 },
      }}>
        <Typography
          variant="body2"
          fontWeight="600"
          sx={{
            fontFamily: 'Playfair Display, serif',
            mb: 0.1,
            textAlign: 'left',
            fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
            color: '#222',
            lineHeight: 1.1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}
        >
          {product.name}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 0 }}>
          <Typography variant="body2" sx={{
            fontWeight: 700,
            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
            color: '#222',
            width: 'auto'
          }}>
            ₹{product.price}
          </Typography>
          {product.oldPrice && product.oldPrice > product.price && (
            <Typography variant="caption" sx={{
              textDecoration: 'line-through',
              color: '#888',
              fontWeight: 500,
              fontSize: { xs: '0.55rem', sm: '0.6rem' },
              ml: 0.5
            }}>
              ₹{product.oldPrice}
            </Typography>
          )}
        </div>
        <Button
          variant="contained"
          size="small"
          fullWidth
          sx={{
            borderRadius: 0.5,
            fontWeight: 600,
            background: '#222',
            color: '#fff',
            fontSize: { xs: '0.5rem', sm: '0.55rem' },
            padding: { xs: '2px 0', sm: '3px 0' },
            minHeight: { xs: '18px', sm: '22px' },
            mt: 0.25,
            '&:hover': { background: '#555', color: '#fff' }
          }}
          onClick={onClick}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  </div>
);

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
        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={toggleDrawer(true)}>
              <FilterListIcon />
            </IconButton>
          </Box>
        )}
        {/* Desktop Filters and Product Grid - only once! */}
        {/* Filter box here ONLY ONCE */}
        {!isMobile ? (
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={3}>
              {/* Filter Sidebar */}
              <Box
                sx={{
                  position: 'sticky',
                  top: 90,
                  zIndex: 2,
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 3,
                  mb: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {!isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FilterListIcon sx={{ mr: 1, color: '#333' }} />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Filters
                    </Typography>
                  </Box>
                )}
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
            </Grid>
            <Grid item xs={12} md={9}>
              {/* Product Cards: 4 per row grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                {sortedProducts.map((product, index) => (
                  <ProductCard key={index} product={product} onClick={() => handleBuyClick(product)} />
                ))}
              </Box>
              {/* Load More button */}
              {!query.trim() && currentPage < totalPages && (
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Button variant="outlined" sx={{ color: '#333', borderColor: '#333', fontWeight: 600, '&:hover': { backgroundColor: '#333', color: '#fff', borderColor: '#333' } }} onClick={loadMore}>
                    Load More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : (
          // Mobile/tablet layout (unchanged)
          <>
            {/* Mobile Filter Button (only here!) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {sortedProducts.map((product, index) => (
                <ProductCard key={index} product={product} onClick={() => handleBuyClick(product)} />
              ))}
            </Box>
            {/* Load More button */}
            {!query.trim() && currentPage < totalPages && (
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Button variant="outlined" sx={{ color: '#333', borderColor: '#333', fontWeight: 600, '&:hover': { backgroundColor: '#333', color: '#fff', borderColor: '#333' } }} onClick={loadMore}>
                  Load More
                </Button>
              </Grid>
            )}
          </>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box sx={{ width: 'auto', p: 2 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
              Filters
            </Typography>
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

        {/* Products Section */}
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

            {!query.trim() && currentPage < totalPages && (
              <Grid container justifyContent="center" sx={{ mt: 3 }}>
                <Button variant="outlined" sx={{ color: '#333', borderColor: '#333', fontWeight: 600, '&:hover': { backgroundColor: '#333', color: '#fff', borderColor: '#333' } }} onClick={loadMore}>
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
