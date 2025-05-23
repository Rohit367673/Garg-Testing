// routes/ShipRocket.js
import express from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const twilio = require("twilio");

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function getShiprocketToken() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );
    return response.data.token;
  } catch (error) {
    console.error(
      "ShipRocket authentication error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Authentication failed");
  }
}



// Shiprocket webhook for order status updates with WhatsApp notification via Twilio
router.post('/shiprocket-webhook', async (req, res) => {
  try {
    // Assume the Shiprocket webhook sends a JSON payload with order and product details.
    const payload = req.body;
    
    // Extract order details (adjust keys as per your actual payload)
    const orderId = payload.order_id;
    const orderStatus = payload.order_status;
    const customerMobile = payload.customer_mobile;  // Ensure format e.g. "+919876543210"
    
    // Extract product details (assumed structure; adjust as needed)
    const productDetails = payload.product_details || {};
    const productName = productDetails.name || "your product";
    const productPrice = productDetails.price ? `₹${productDetails.price}` : "";
    const productImage = productDetails.image_url; // URL to the product image

    // Build an attractive message using formatting supported by WhatsApp
    const messageBody = `✨ *Order Update* ✨

Hello! Your order *#${orderId}* for *${productName}* ${productPrice ? `(${productPrice})` : ""} has been updated to *${orderStatus}*. 

Thank you for shopping with us! We will keep you updated on your order's progress.`;

    // Your Twilio WhatsApp sender number (sandbox or approved sender)
    const fromWhatsAppNumber = 'whatsapp:+14155238886'; // For sandbox testing

    // Build message parameters; attach product image as media if available
    const messageParams = {
      from: fromWhatsAppNumber,
      body: messageBody,
      to: `whatsapp:${customerMobile}`,
    };

    if (productImage) {
      messageParams.mediaUrl = [productImage];
    }

    const message = await client.messages.create(messageParams);

    console.log('WhatsApp message sent:', message.sid);
    res.status(200).json({ success: true, message: 'Notification sent', sid: message.sid });
  } catch (error) {
    console.error('Error processing Shiprocket webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
