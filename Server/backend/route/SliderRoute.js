// route/SliderRoute.js
import express from "express";
import multer from "multer";
import Slider from "../Models/Slider.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use multer's memory storage so files stay in memory (as a buffer)
const storage = multer.memoryStorage();
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

router.post("/slider", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file was uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Uploaded file details:", req.file);

    // Convert the file buffer to a Data URI
    const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Upload the Data URI to Cloudinary (in the "slider_images" folder)
    cloudinary.uploader.upload(
      dataURI,
      { folder: "slider_images" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed." });
        }
        console.log("Cloudinary upload result:", result);

        // Save the secure URL returned by Cloudinary in your database
        const slider = new Slider({ imageUrl: result.secure_url });
        const savedSlider = await slider.save();

        // Since the file is in memory, there's no local file to remove
        res.status(201).json({
          message: "Slider image uploaded successfully",
          slider: savedSlider,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading slider image:", error);
    res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
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
