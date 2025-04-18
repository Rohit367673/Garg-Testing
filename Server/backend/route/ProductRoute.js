import express from "express";
import multer from "multer";
import ProductModel from "../Models/Product.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,   
});

// Use multer's memory storage
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

// POST /api/products - Create a new product with Cloudinary image uploads
router.post("/products", upload.array("images", 10), async (req, res) => {
  try {
    const { name, description, price, size, color, quantity, Catagory, brand } = req.body;
    
    if (!name || !price || !Catagory) {
      return res.status(400).json({ error: "Name, price and Catagory are required" });
    }

    let parsedSize = size;
    let parsedColor = color;
    try {
      if (typeof size === "string") {
        parsedSize = JSON.parse(size);
      }
    } catch (err) {
      parsedSize = [];
    }
    try {
      if (typeof color === "string") {
        parsedColor = JSON.parse(color);
      }
    } catch (err) {
      parsedColor = [];
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) => {
      const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      return cloudinary.uploader.upload(dataURI, { folder: "product_images" });
    });
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Create the product object with the initial stock quantity
    const product = new ProductModel({
      name,
      description,
      price,
      size: parsedSize,
      color: parsedColor,
      quantity,  // initial stock count
      Catagory,
      images: imageUrls,
      brand,
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

// GET /api/products - Fetch products with optional filtering and pagination.
router.get("/products", async (req, res) => {
  try {
    const { category, brand, page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const query = {};
    if (category && category.toLowerCase() !== "all") {
      query.Catagory = category;
    }
    if (brand && brand.toLowerCase() !== "all") {
      query.brand = brand;
    }
    
    const products = await ProductModel.find(query).skip(skip).limit(limitNum);
    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.json({ 
      products, 
      totalProducts, 
      currentPage: pageNum, 
      totalPages 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET /api/products/:id - Fetch a single product by its ID.
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

// DELETE /api/products/:id - Delete a product by its ID.
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

// POST /api/purchase - Update product quantity when a purchase is made.
router.post("/purchase", async (req, res) => {
  const { productId, purchaseQty } = req.body;
  try {
    // Retrieve the product
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Check if sufficient stock is available
    if (product.quantity < purchaseQty) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    // Atomically subtract the purchased quantity
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { quantity: -purchaseQty } },
      { new: true }
    );
    res.status(200).json({
      message: "Purchase successful",
      newQuantity: updatedProduct.quantity,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/recommended-products - Fetch recommended products based on category.
router.get("/recommended-products", async (req, res) => {
  try {
    const { category } = req.query;
    const recommendedProducts = await ProductModel.find({ Catagory: category }).limit(5);
    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
