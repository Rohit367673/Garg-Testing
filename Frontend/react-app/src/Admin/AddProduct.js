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

// Extended mapping for shipping details based on product type
const shippingData = {
  tshirt: { weight: 0.3, dimensions: "30x25x5" },
  jacket: { weight: 0.8, dimensions: "40x30x10" },
  leather_jacket: { weight: 1.2, dimensions: "42x32x12" },
  long_coat: { weight: 1.5, dimensions: "45x35x15" },
  medium_coat: { weight: 1.2, dimensions: "42x30x12" },
  wallet: { weight: 0.2, dimensions: "15x10x3" },
  winter_sweater: { weight: 0.6, dimensions: "35x30x8" },
  suit: { weight: 1.0, dimensions: "40x32x10" },
  indian_wedding_suit: { weight: 1.3, dimensions: "42x35x12" },
  kurta: { weight: 0.4, dimensions: "32x28x6" },
  lehenga: { weight: 0.8, dimensions: "38x34x10" },
  sherwani: { weight: 1.0, dimensions: "40x35x12" },
  gown: { weight: 1.0, dimensions: "40x30x10" },
};

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    // We'll let the user enter comma-separated values
    size: "",
    color: "",
    stock: "In Stock",
    // Storefront categorization (Mens, Women, Kids, Accessories)
    Catagory: "",
    // Product type used for shipping details mapping
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

  // Get shipping details based on selected product type
  const shippingInfo =
    shippingData[product.productType] || { weight: 0.5, dimensions: "30x25x5" };

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", Number(product.price)); // Convert price to number

  // Split the comma-separated strings into arrays and append each value separately
  const sizeArray = product.size.split(",").map((s) => s.trim()).filter(s => s);
  const colorArray = product.color.split(",").map((s) => s.trim()).filter(s => s);

  sizeArray.forEach((s) => formData.append("size", s));
  colorArray.forEach((c) => formData.append("color", c));

  formData.append("stock", product.stock);
  // Use the correct key "Catagory" (with capital C) to match your schema
  formData.append("Catagory", product.Catagory);
  formData.append("productType", product.productType);
  // Append shipping details
  formData.append("weight", shippingInfo.weight);
  formData.append("dimensions", shippingInfo.dimensions);

  // Append each image
  product.images.forEach((image) => {
    formData.append("images", image);
  });

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/products`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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
          {/* Product Type Selection (For Shipping) */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Product Type</InputLabel>
              <Select
                label="Product Type"
                name="productType"
                value={product.productType}
                onChange={handleChange}
              >
                <MenuItem value="tshirt">T-Shirt</MenuItem>
                <MenuItem value="jacket">Jacket</MenuItem>
                <MenuItem value="leather_jacket">Leather Jacket</MenuItem>
                <MenuItem value="long_coat">Long Coat</MenuItem>
                <MenuItem value="medium_coat">Medium Coat</MenuItem>
                <MenuItem value="wallet">Wallet</MenuItem>
                <MenuItem value="winter_sweater">Winter Sweater</MenuItem>
                <MenuItem value="suit">Suit</MenuItem>
                <MenuItem value="indian_wedding_suit">Indian Wedding Suit</MenuItem>
                <MenuItem value="kurta">Kurta</MenuItem>
                <MenuItem value="lehenga">Lehenga</MenuItem>
                <MenuItem value="sherwani">Sherwani</MenuItem>
                <MenuItem value="gown">Gown</MenuItem>
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
