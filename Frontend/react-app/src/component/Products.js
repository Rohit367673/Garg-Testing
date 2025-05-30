import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const Products = () => {
  const [selectedProductType, setSelectedProductType] = useState("all");

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedProductType !== "all") params.append("productType", selectedProductType);
      
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products?${params.toString()}`
      );
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const handleProductTypeChange = (event) => {
    setSelectedProductType(event.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedProductType]);

  return (
    <Box sx={{ p: 3 }}>
      <FormControl sx={{ minWidth: 200, mb: 2, mr: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="men">Men</MenuItem>
          <MenuItem value="women">Women</MenuItem>
          <MenuItem value="kids">Kids</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Product Type</InputLabel>
        <Select
          value={selectedProductType}
          onChange={handleProductTypeChange}
          label="Product Type"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="Casual Outfits">Casual Outfits</MenuItem>
          <MenuItem value="Formal Wear">Formal Wear</MenuItem>
          <MenuItem value="Traditional Wear">Traditional Wear</MenuItem>
          <MenuItem value="Party Outfits">Party Outfits</MenuItem>
          <MenuItem value="Winter Outfits">Winter Outfits</MenuItem>
          <MenuItem value="Summer Outfits">Summer Outfits</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default Products; 