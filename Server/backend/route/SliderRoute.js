// route/SliderRoute.js
import express from "express";
import multer from "multer";
import fs from "fs";
import Slider from "../Models/Slider.js";
import mongoose from "mongoose";

const router = express.Router();

// Configure Multer storage (reusing the uploads directory)
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB limit
});

// POST /api/slider - Upload a new slider image
router.post("/slider", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file was uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }
    // Log file info for debugging
    console.log("Uploaded file details:", req.file);
    
    // Remove the "uploads/" prefix from the path if desired
    const filePath = req.file.path.replace(/^uploads\//, "");
    
    const slider = new Slider({ imageUrl: filePath });
    const savedSlider = await slider.save();
    res.status(201).json({
      message: "Slider image uploaded successfully",
      slider: savedSlider,
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
