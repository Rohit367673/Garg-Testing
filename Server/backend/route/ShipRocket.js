// routes/ShipRocket.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


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

// Route to create a new shipping order
router.post("/create-order", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    // Construct payload with all required fields.
    // Adjust the values as per your business logic or ShipRocket's documentation.
    const payload = {
      order_date: new Date().toISOString().split("T")[0], 
      channel_id: 6347160, 
      payment_method: "Prepaid", 
      billing_customer_name: req.body.addressInfo.name || "Customer",
      billing_last_name: "",
      billing_phone: req.body.addressInfo.phone,
      billing_address: req.body.addressInfo.street,
      billing_city: req.body.addressInfo.city,
      billing_state: req.body.addressInfo.state,  // Added required billing_state
      billing_pincode: req.body.addressInfo.postalCode, // Added required billing_pincode
      billing_country: "India",
      shipping_is_billing: true, // Assuming shipping address is same as billing
      // Map order items from cartItems array
      order_items: req.body.cartItems.map(item => ({
        name: item.productName,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn_code: "NA"
      })),
      sub_total: req.body.totalAmount,
    
      length: 10,
      breadth: 10,
      height: 10,
      weight: 500, 
      order_id: req.body.orderId || "" 
    };

    // Make sure you are using the correct endpoint for order creation.
    const shiprocketResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(shiprocketResponse.data);
  } catch (error) {
    console.error(
      "Error creating shipping order:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      error: error.response ? error.response.data : error.message,
    });
  }
});

export default router;
