// routes/whatsapp.js
import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Get credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// POST /api/whatsapp/send - Send WhatsApp message with order details
router.post('/send', async (req, res) => {
  try {
    const { userNumber, orderDetails } = req.body;
    // Ensure userNumber is in international format (e.g., +1234567890)
    // Customize your message body using orderDetails
    const messageBody = `Thank you for your order! Your order details: ${orderDetails}`;

    // Use your Twilio WhatsApp sandbox number or your approved sender
    const fromWhatsAppNumber = 'whatsapp:+14155238886';

    const message = await client.messages.create({
      from: fromWhatsAppNumber,
      body: messageBody,
      to: `whatsapp:${userNumber}`,
    });

    res.status(200).json({ message: 'WhatsApp message sent', sid: message.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
