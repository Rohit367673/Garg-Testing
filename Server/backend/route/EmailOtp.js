
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();


const otpStore = {};


router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
 
  otpStore[email] = otp;


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS, 
    },
  });

  // Compose an attractive email message
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #4CAF50;">Welcome to Garg Exclusive</h2>
        <p style="font-size: 16px;">Your One-Time Password (OTP) for email verification is:</p>
        <h1 style="color: #FF5722;">${otp}</h1>
        <p style="font-size: 14px;">Please enter this OTP on the signup page. It is valid for 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">Thank you for joining us.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again later." });
  }
});


router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
   
    delete otpStore[email];
    res.status(200).json({ message: "Email verified successfully." });
  } else {
    res.status(400).json({ error: "Invalid OTP. Please try again." });
  }
});

export default router;
