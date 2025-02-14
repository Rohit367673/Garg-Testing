// routes/otpRoutes.js
import express from 'express';
import twilio from "twilio";
const router = express.Router();
import dotenv from 'dotenv';
// In-memory store for OTPs (mobile -> { otp, expiresAt })
const otpStore = new Map();
 
dotenv.config();
// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

/**
 * POST /send-otp
 * Request body: { mobile: "1234567890" }
 */
router.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number is required" });
  }
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
  otpStore.set(mobile, { otp, expiresAt });
  
  try {
    // Send SMS using Twilio
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber, // Your Twilio phone number
      to: mobile, // Ensure mobile is in the correct format (e.g., with country code)
    });
    console.log(`OTP sent via SMS: ${otp} to mobile ${mobile}`);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending SMS via Twilio:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

/**
 * POST /verify-otp
 * Request body: { mobile: "1234567890", otp: "123456" }
 */
router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
  }
  const record = otpStore.get(mobile);
  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found for this mobile number" });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }
  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
  // OTP verified; remove from store
  otpStore.delete(mobile);
  return res.status(200).json({ success: true, message: "OTP verified successfully" });
});

export default router;
