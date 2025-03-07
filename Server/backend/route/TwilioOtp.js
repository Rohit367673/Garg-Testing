// routes/twilioOtp.js
import express from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const twilio = require("twilio");
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Your Verify Service SID
const client = twilio(accountSid, authToken);

// Endpoint to send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });
    res.status(200).json({ message: "OTP sent", status: verification.status });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verificationCheck = await client.verify
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });
    res.status(200).json({ message: "OTP verification result", status: verificationCheck.status });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
