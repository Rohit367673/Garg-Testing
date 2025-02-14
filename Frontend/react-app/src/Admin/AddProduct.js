import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    images: [],  // Store multiple images
    size: '',
    color: '',
    stock: 'In Stock',
    category: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert file list to array
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...files], // Add selected images to state
    }));
  };

  // Handle form submission (upload product data to server)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('size', product.size);
    formData.append('color', product.color);
    formData.append('stock', product.stock);
    formData.append('category', product.category);

    // Append each image to FormData
    product.images.forEach((image) => {
      formData.append('images', image); // The key 'images' is used to store the image files
    });

    try {
      const response = await axios.post('http://localhost:3001/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
       toast.success("Successfully uploaded")
      console.log(response.data);
      // Handle success (e.g., show a success message or reset the form)
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Box sx={{ margin: 3 }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}></Grid>


          <Grid item xs={12}></Grid>
          {/* Image Upload Field */}
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload} // Handle file selection
              style={{ display: 'block', margin: '10px 0' }} // Optional: Style the input
            />
            <div>
              {product.images.length > 0 &&
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)} // Preview the image before upload
                    alt={`Preview ${index}`}
                    width="100"
                    style={{ margin: '5px' }}
                  />
                ))}
            </div>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={product.category}
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
            <TextField
              fullWidth
              label="Size"
              name="size"
              value={product.size}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </Grid>
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
