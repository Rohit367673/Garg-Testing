import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Paper,
} from "@mui/material";

function AdminSlider() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/slider`
      );
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching slider images", err);
    }
  };

  // Trigger the hidden file input when "Choose File" is clicked
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Update state when a file is selected
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload the selected file to the backend
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/slider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", res.data);
      setSelectedFile(null);
      fetchImages();
    } catch (err) {
      console.error("Error uploading slider image", err);
      alert(
        "Error uploading slider image: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  // Delete a slider image by its ID
  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/slider/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Error deleting slider image", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Slider Management
      </Typography>

      {/* Upload Form */}
      <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Add New Slider Image
        </Typography>
        <form onSubmit={handleUploadImage}>
          {/* Hidden file input */}
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button variant="outlined" onClick={handleChooseFile}>
              Choose File
            </Button>
            {selectedFile && <Typography>{selectedFile.name}</Typography>}
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Upload Image
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Current Slider Images
      </Typography>

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                // Use the full Cloudinary URL directly
                image={image.imageUrl}
                alt="Slider"
              />
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteImage(image._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdminSlider;
