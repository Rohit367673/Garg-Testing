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
    const {
      name, description, price,
      quantity, Catagory, brand
    } = req.body;

    if (!name || !price || !Catagory) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Parse array fields
    const parseArr = (field) =>
      Array.isArray(req.body[field])
        ? req.body[field]
        : typeof req.body[field] === "string"
        ? req.body[field].split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const sizes    = parseArr("size");
    const colors   = parseArr("color");
    const outSizes = parseArr("outSizes");
    const outColors= parseArr("outColors");

    // Upload images
    const uploads = req.files.map(f =>
      cloudinary.uploader.upload(
        `data:${f.mimetype};base64,${f.buffer.toString("base64")}`,
        { folder: "product_images" }
      )
    );
    const results = await Promise.all(uploads);
    const images  = results.map(r => r.secure_url);

    const product = new ProductModel({
      name,
      description,
      price,
      size:       sizes,
      color:      colors,
      outSizes,
      outColors,
      quantity,
      Catagory,
      brand,
      images,
    });

    const saved = await product.save();
    res.status(201).json({ message: "Created", product: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products - Fetch products with optional filtering and pagination.

router.get("/products", async (req, res) => {
  try {
    const { category, brand, page, limit } = req.query;

    // Build the basic Mongo query
    const query = {};
    if (category && category.toLowerCase() !== "all") {
      query.Catagory = category;
    }
    if (brand && brand.toLowerCase() !== "all") {
      query.brand = brand;
    }

    // Start your Mongoose query
    let productsQuery = ProductModel.find(query);

    // Only apply pagination if `limit` is provided
    if (limit) {
      const pageNum  = parseInt(page, 10)  || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip     = (pageNum - 1) * limitNum;

      productsQuery = productsQuery
        .skip(skip)
        .limit(limitNum);
    }

    // Execute the query
    const products      = await productsQuery;
    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages    = limit
      ? Math.ceil(totalProducts / parseInt(limit, 10))
      : 1;

    res.json({
      products,
      totalProducts,
      currentPage: limit ? parseInt(page, 10) || 1 : 1,
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
