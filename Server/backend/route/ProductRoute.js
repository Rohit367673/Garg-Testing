// route/ProductRoute.js
import express from "express";
import multer from "multer";
import ProductModel from "../Models/Product.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,   
});

// Use multer's memory storage so files remain in memory (as a buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, JPG, GIF, and WEBP files are allowed."));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/products - Create a new product with images uploaded to Cloudinary
router.post("/products", upload.array("images", 10), async (req, res) => {
  try {
    const { name, description, price, size, color, stock, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    // For each file, convert the buffer to a Data URI and upload to Cloudinary
    const uploadPromises = req.files.map((file) => {
      const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      return cloudinary.uploader.upload(dataURI, { folder: "product_images" });
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = new ProductModel({
      name,
      description,
      price,
      size,
      color,
      stock,
      category,
      images: imageUrls,
    });

    const savedProduct = await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// GET /api/products - Fetch all products or filter by category
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const products =
      category && category !== "All"
        ? await ProductModel.find({ category })
        : await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

router.get("/recommended-products", async (req, res) => {
  try {
    const { category } = req.query;
    const recommendedProducts = await ProductModel.find({ category }).limit(5);
    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
