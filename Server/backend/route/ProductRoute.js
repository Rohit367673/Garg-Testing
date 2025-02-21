import express from "express";
import multer from "multer";
import fs from "fs";
import ProductModel from "../Models/Product.js";
import mongoose from "mongoose";


const router = express.Router();
// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =  "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed."));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});





// POST /api/products - Create a new product
router.post("/products", upload.array("images", 10), async (req, res) => {
    try {
      const { name, description, price, size, color, stock, category } = req.body;
  
      if (!name || !price || !category) {
        return res.status(400).json({ error: "Name, price, and category are required." });
      }
  
      // Store the image file names without the 'uploads/' prefix
      const imagePaths = req.files.map((file) => file.path.replace(/^uploads\//, ''));
  
      const product = new ProductModel({
        name,
        description,
        price,
        size,
        color,
        stock,
        
        category,
        images: imagePaths,
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

    const products = category && category !== "All"
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
