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
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],

    size: "",
    color: "",
    stock: "In Stock",
    quantity: "",
    brand: "",
    Catagory: "",

    productType: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...files],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Determine stock status based on quantity
    const stockStatus = Number(product.quantity) > 0 ? "In Stock" : "Out of Stock";
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", Number(product.price));
    
    // Process comma-separated size and color fields as before
    const sizeArray = product.size.split(",").map((s) => s.trim()).filter(s => s);
    const colorArray = product.color.split(",").map((s) => s.trim()).filter(s => s);
    sizeArray.forEach((s) => formData.append("size", s));
    colorArray.forEach((c) => formData.append("color", c));
  
    // Append quantity, brand, and computed stock status
    formData.append("quantity", product.quantity);
    formData.append("brand", product.brand);
    formData.append("stock", stockStatus);
    formData.append("Catagory", product.Catagory);
  
    // Append images
    product.images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Successfully uploaded");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  return (
    <Box sx={{ margin: 3 }}>
      <h2 className="mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Product Name */}
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
          {/* Image Upload */}
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "block", margin: "10px 0" }}
            />
            <div>
              {product.images.length > 0 &&
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    width="100"
                    style={{ margin: "5px" }}
                  />
                ))}
            </div>
          </Grid>
          {/* Catagory Selection (Storefront) */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Catagory</InputLabel>
              <Select
                label="Catagory"
                name="Catagory"
                value={product.Catagory}
                onChange={handleChange}
              >
                <MenuItem value="Mens">Mens</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
                <MenuItem value="Acessories">Accessories</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Size Field (enter comma-separated values) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Size "
              name="size"
              value={product.size}
              onChange={handleChange}
            />
          </Grid>
          {/* Color Field (enter comma-separated values) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Color "
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </Grid>
          {/* Quantity Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={product.quantity}
              onChange={handleChange}
            />
          </Grid>

          {/* Brand Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
            />
          </Grid>

          {/* Stock */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Stock</InputLabel>
              <Select
                label="Stock"
                name="stock"
                value={product.stock}
                onChange={handleChange}
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
