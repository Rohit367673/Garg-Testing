// route/SliderRoute.js
import express from "express";
import multer from "multer";
import fs from "fs";
import Slider from "../Models/Slider.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config(); 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,   
});



// Configure Multer to temporarily store files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
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
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed."));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// POST /api/slider - Upload a new slider image to Cloudinary
router.post("/slider", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file was uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }
    // Log file info for debugging
    console.log("Uploaded file details:", req.file);
    const filePath = req.file.path;

    // Upload the file to Cloudinary in the "slider_images" folder
    cloudinary.uploader.upload(filePath, { folder: "slider_images" }, async (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Cloudinary upload failed." });
      }
      console.log("Cloudinary upload result:", result);
      
      // Save the secure URL returned by Cloudinary in your database
      const slider = new Slider({ imageUrl: result.secure_url });
      const savedSlider = await slider.save();

      // Remove the local file after a successful upload
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error removing local file:", err);
      });

      res.status(201).json({
        message: "Slider image uploaded successfully",
        slider: savedSlider,
      });
    });
  } catch (error) {
    console.error("Error uploading slider image:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// GET /api/slider - Fetch all slider images
router.get("/slider", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders);
  } catch (error) {
    console.error("Error fetching slider images:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/slider/:id - Delete a slider image by its ID
router.delete("/slider/:id", async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: "Slider image not found" });
    }
    res.status(200).json({ message: "Slider image deleted successfully" });
  } catch (error) {
    console.error("Error deleting slider image:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
