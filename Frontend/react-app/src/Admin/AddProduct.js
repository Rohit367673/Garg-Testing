import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    // In-stock values
    size: "",
    color: "",
    // Out-of-stock values
    outSizes: "",
    outColors: "",
    quantity: "",
    brand: "",
    Catagory: "",
    productType: "",
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection (preserve previous functionality)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine stock status
    const stockStatus =
      Number(product.quantity) > 0 ? "In Stock" : "Out of Stock";

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("brand", product.brand);
    formData.append("stock", stockStatus);
    formData.append("Catagory", product.Catagory);
    formData.append("productType", product.productType);

    // Append in-stock sizes and colors
    product.size
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => formData.append("size", s));
    product.color
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => formData.append("color", c));

    // Append out-of-stock sizes and colors
    product.outSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => formData.append("outSizes", s));
    product.outColors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => formData.append("outColors", c));

    // Append images
    product.images.forEach((file) => formData.append("images", file));

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product added successfully!");
      // Reset form after successful submission
      setProduct({
        name: "",
        description: "",
        price: "",
        images: [],
        size: "",
        color: "",
        outSizes: "",
        outColors: "",
        quantity: "",
        brand: "",
        Catagory: "",
        productType: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Price */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="Catagory"
                value={product.Catagory}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="Mens">Mens</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
              </Select>
            </FormControl>
          </Grid>
           <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Product Type</InputLabel>
            <Select
              value={product.productType}
              onChange={handleChange}
              name="productType"
              label="Product Type"
              required
            >
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Formal">Formal</MenuItem>
              <MenuItem value="Traditional">Traditional</MenuItem>
              <MenuItem value="Party Wear">Party Wear</MenuItem>
              <MenuItem value="Summer">Summer Outfits</MenuItem>
              <MenuItem value="Winter">Winter Outfits</MenuItem>
            </Select>
          </FormControl>
</Grid>
          {/* In-stock Size & Color */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Size (in stock, comma-separated)"
              name="size"
              value={product.size}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color (in stock, comma-separated)"
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </Grid>

          {/* Out-of-stock Size & Color */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Out of Stock Sizes (comma-separated)"
              name="outSizes"
              value={product.outSizes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Out of Stock Colors (comma-separated)"
              name="outColors"
              value={product.outColors}
              onChange={handleChange}
            />
          </Grid>

          {/* Quantity & Brand */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <InputLabel>Product Images</InputLabel>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "block", marginTop: 8 }}
            />
            <Box mt={1} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {product.images.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={URL.createObjectURL(img)}
                  alt="Preview"
                  width={80}
                  height={80}
                  sx={{ objectFit: "cover" }}
                />
              ))}
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
