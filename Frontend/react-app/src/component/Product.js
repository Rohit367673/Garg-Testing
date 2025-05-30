import express from "express";
import multer from "multer";
import ProductModel from "../Models/Product.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Error checking admin status" });
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,   
});

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


router.post("/products", upload.array("images", 10), async (req, res) => {
  try {
    const {
      name, description, price,
      quantity, Catagory, brand,
      productType // NEW: Capture productType from req.body
    } = req.body;

    if (!name || !price || !Catagory || !productType) {
      return res.status(400).json({ error: "Required fields missing (name, price, category, productType)" });
    }

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
      productType, // NEW: Save productType to DB
      images,
    });

    const saved = await product.save();
    res.status(201).json({ message: "Created", product: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { category, brand, page, limit, productType } = req.query;

    const query = {};
    if (category && category.toLowerCase() !== "all") {
      query.Catagory = category;
    }
    if (brand && brand.toLowerCase() !== "all") {
      query.brand = brand;
    }
    if (productType && productType.toLowerCase() !== "all") {
      query.productType = productType;
    }

    let productsQuery = ProductModel.find(query);

    if (limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      productsQuery = productsQuery
        .skip(skip)
        .limit(limitNum);
    }

    const products = await productsQuery;
    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = limit
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

// Only allow admin to delete products
router.delete("/products/:id", isAdmin, async (req, res) => {
  try {
    // Additional security check - verify the request is coming from the admin interface
    const referer = req.headers.referer;
    if (!referer || !referer.includes('/admin')) {
      return res.status(403).json({ message: "Delete operation only allowed from admin interface" });
    }

    // First find the product to get its images
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        // Extract public IDs from Cloudinary URLs
        const publicIds = product.images.map(url => {
          const parts = url.split('/');
          const filename = parts[parts.length - 1].split('.')[0];
          return `product_images/${filename}`;
        });

        // Delete images from Cloudinary
        await Promise.all(
          publicIds.map(publicId =>
            cloudinary.uploader.destroy(publicId)
          )
        );
        console.log(`Successfully deleted ${publicIds.length} images from Cloudinary for product ${product._id}`);
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with product deletion even if Cloudinary deletion fails
      }
    }

    // Delete the product from MongoDB
    await ProductModel.findByIdAndDelete(req.params.id);
    
    // Log the deletion
    console.log(`Product deleted by admin ${req.user.id}: ${product._id} - ${product.name}`);
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

router.post("/purchase", async (req, res) => {
  const { productId, purchaseQty } = req.body;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.quantity < purchaseQty) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
  
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


router.get("/recommended-products", async (req, res) => {
  try {
    const { category } = req.query;
    const recommendedProducts = await ProductModel.find({ Catagory: category }).limit(5);
    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/products/search", async (req, res) => {
  try {
    const { query, category } = req.query;
    
    
    const filter = {};
    if (category) {
      filter.Catagory = category;
    }

    const results = await ProductModel
      .find(
        { 
          ...filter,
          $text: { $search: query || "" } 
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .lean();
    const formattedResults = results.map(product => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString()
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});

export default router;
