// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import UserModel from "./Models/User.js";
import ProductModel from "./Models/Product.js";
import CartModel from "./Models/Cart.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./route/ProductRoute.js";
import sliderRoute from "./route/SliderRoute.js"; 
import Razorpay from "razorpay";
import OrderModel from "./Models/Order.js";
import dotenv from "dotenv";
import crypto from "crypto";
import admin from "firebase-admin";
import ReviewsModel from "./Models/Reviews.js";
import OrderRoute from "./route/OrderHistoryRoute.js"
import TwilioRoute from "./route/TwilioRoute.js"
import twilioOtpRouter from "./route/TwilioOtp.js"
import EmailOtp from "./route/EmailOtp.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
    },
  })
);

app.use("/api", productRoutes);
app.use("/api", sliderRoute);
app.use("/api/orders",OrderRoute);
app.use("/api/whatsapp",TwilioRoute);
app.use("/api/otp", twilioOtpRouter);
app.use("/api/otp",EmailOtp)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Payment part
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


app.post("/create-order", async (req, res) => {
  try {
    const { userId, cartId, cartItems, totalAmount, paymentMethod, addressInfo } = req.body;

    if (!userId || !cartItems || !totalAmount || !paymentMethod || !addressInfo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("✅ Received Order Data:", req.body);

    const processedCartItems = cartItems.map(item => {
      const prodId = item.productId || item.id;
      if (!prodId || !mongoose.Types.ObjectId.isValid(prodId)) {
        throw new Error(`Invalid product id: ${prodId}`);
      }
      return {
        productId: new mongoose.Types.ObjectId(prodId),
        productName: item.productName,
        imgsrc: item.imgsrc,
        price: Number(item.price),
        quantity: Number(item.quantity),
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      };
    });

    const newOrder = new OrderModel({
      userId: new mongoose.Types.ObjectId(userId),
      cartId:
        cartId && mongoose.Types.ObjectId.isValid(cartId)
          ? new mongoose.Types.ObjectId(cartId)
          : undefined,
      cartItems: processedCartItems,
      addressInfo: {
        addressId: new mongoose.Types.ObjectId(),
        address: addressInfo.street,
        city: addressInfo.city,
        pincode: addressInfo.postalCode,
        phone: addressInfo.phone,
      },
      paymentMethod,
      totalAmount: Number(totalAmount),
      orderStatus: "Pending",
      paymentStatus: "Unpaid",
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order Saved in MongoDB:", savedOrder);

    if (isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }
    console.log("🛒 Total Amount to be charged:", totalAmount);

    const options = {
      amount: Number(totalAmount) * 100, // Convert to paise
      currency: "INR",
      receipt: savedOrder._id.toString(),
      payment_capture: 1,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      console.log("✅ Razorpay Order Created:", razorpayOrder);
      const orderId = razorpayOrder.id || razorpayOrder.order_id;
      if (!orderId) {
        throw new Error("Razorpay order id is missing in the response");
      }

      // Save the Razorpay order id in the order document
      await OrderModel.findByIdAndUpdate(savedOrder._id, { razorpayOrderId: orderId });

      res.json({ orderId, dbOrderId: savedOrder._id });
    } catch (razorpayError) {
      console.error("❌ Razorpay Order Creation Error:", razorpayError);
      return res.status(500).json({ error: "Failed to create Razorpay order", details: razorpayError });
    }
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: "Order creation failed", details: error.message });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment details" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    await OrderModel.findByIdAndUpdate(dbOrderId, {
      paymentStatus: "Paid",
      orderStatus: "Processing",
      paymentId: razorpay_payment_id,
    });

    console.log("✅ Payment Verified for Order:", dbOrderId);
    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ error: "Payment verification failed", details: error.message });
  }
});

// Only one definition for user-orders route is kept
app.get("/user-orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await OrderModel.find({ userId: userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found." });
    }
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});
app.put('/orders/:id', async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Capture previous status to ensure we update quantity only once
    const prevStatus = order.orderStatus;
    
    // Update the order status from the request body (e.g., 'approved')
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    await order.save();

    // If order is being approved now (and wasn't already approved)
    if (
      order.orderStatus.toLowerCase() === 'approved' &&
      prevStatus.toLowerCase() !== 'approved'
    ) {
      // Loop through each cart item in the order and update product quantity
      for (const item of order.cartItems) {
        // Atomically subtract the order quantity from the product's stock quantity
        await ProductModel.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } }
        );
      }
    }
    
    res.json({
      message: 'Order updated successfully',
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};



// Firebase OTP authentication middleware
async function authenticate(req, res, next) {
  const authToken = req.headers.authorization?.split(" ")[1];
  if (!authToken) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).send("Unauthorized: Invalid token");
  }
}

// User registration
app.post("/register", async (req, res) => {
  try {
    const { Name, Email, Number, Pass } = req.body;

    if (!Name || !Email || !Number || !Pass) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(Pass, 10);
    const user = await UserModel.create({ Name, Email, Number, Pass: hashedPassword });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).send({ message: "success", id: user._id, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Registration failed!", error: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { Email, Pass } = req.body;
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "No record found" });
    }

    const match = await bcrypt.compare(Pass, user.Pass);
    if (match) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "success", token, user: { id: user._id, Name: user.Name, Email: user.Email } });
    }

    return res.status(401).json({ message: "Invalid password" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed!", error: error.message });
  }
});

// Verify token
app.get("/verifyToken", isLoggedIn, (req, res) => {
  res.status(200).json({ message: "success" });
});

// Update user profile
app.post("/updateProfile", isLoggedIn, async (req, res) => {
  try {
    const { id, Name, Email, Number, Pass } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID:", id);
      return res.status(400).send({ message: "Invalid user ID" });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      console.log("User not found for ID:", id);
      return res.status(404).send({ message: "User not found" });
    }

    user.Name = Name;
    user.Email = Email;
    user.Number = Number;

    if (Pass) {
      user.Pass = await bcrypt.hash(Pass, 10);
    }

    await user.save();

    console.log("Profile updated successfully for ID:", id);
    res.send({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// Change password
app.post("/change-password", async (req, res) => {
  const { Email, currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.Pass);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.Pass = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/addCart", async (req, res) => {
  const { userId, productId, productName, imgsrc, price, quantity, selectedSize, selectedColor } = req.body;

  try {
    let cart = await CartModel.findOne({ userId: userId });

    if (!cart) {
      cart = new CartModel({
        userId: new mongoose.Types.ObjectId(userId),
        cartItems: [{
          productId: new mongoose.Types.ObjectId(productId),
          productName,
          imgsrc,
          price: Number(price),
          quantity: Number(quantity),
          selectedSize,
          selectedColor
        }]
      });
    } else {
      const indexFound = cart.cartItems.findIndex(item =>
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );

      if (indexFound !== -1) {
        cart.cartItems[indexFound].quantity += Number(quantity);
      } else {
        cart.cartItems.push({
          productId: new mongoose.Types.ObjectId(productId),
          productName,
          imgsrc,
          price: Number(price),
          quantity: Number(quantity),
          selectedSize,
          selectedColor
        });
      }
      cart.subTotal = cart.cartItems.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
      );
    }

    await cart.save();
    res.status(201).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: product.quantity,
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});

app.post("/google-signup", async (req, res) => {
  // console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
   
    const payload = ticket.getPayload();
    const { email: Email, name: Name, picture: Picture } = payload;

    let user = await UserModel.findOne({ Email });
    if (!user) {
      user = new UserModel({
        Name: Name || "No Name",
        Email: Email || "No Email",
        ProfilePic: Picture || "default-avatar.jpg",
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ message: "success", token: jwtToken, user });
  } catch (error) {
    console.error("Google Sign-Up error:", error);
    res.status(500).json({ message: "Google Sign-Up failed", error: error.message });
  }
});


// In your server.js (or productRoutes.js)
app.get("/products/search", async (req, res) => {
  try {
    const { query } = req.query;
    // console.log("Search query received:", query);
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
  
    const products = await ProductModel.find({
      name: { $regex: query, $options: "i" }
    });

    if (products.length === 0) {

      return res.status(404).json({ message: "No products found" });
    }
    
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: product.quantity,
      category: product.category,
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Error searching products", details: error.message });
  }
});

// Optional: Recommendation endpoint based on category
app.get("/products/recommend", async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "Category is required for recommendations" });
    }
    const recommendedProducts = await ProductModel.find({ category }).limit(5);
    res.status(200).json(recommendedProducts);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Error fetching recommendations", details: error.message });
  }
});



// Email sending route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, description } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: "gargexclusive@gmail.com",
      pass: "kjyfkyzmlzvthhch",
    },
  });

  const mailOptions = {
    from: email,
    to: "gargexclusive@gmail.com",
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${description}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

app.post("/admin/login", (req, res) => {
  console.log("Admin login attempt:", req.body);
  const { Email, Pass } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL 
  const adminPassword = process.env.ADMIN_PASSWORD ;

  console.log("Expected admin email:", adminEmail);
  console.log("Expected admin password:", adminPassword);

  if (Email === adminEmail && Pass === adminPassword) {
    const token = jwt.sign({ Email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Admin login successful");
    return res.json({
      message: "Admin login successful",
      token,
      user: { Email, isAdmin: true },
    });
  } else {
    console.log("Invalid admin credentials");
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// review section
app.post("/api/reviews", async (req, res) => {
  const { productId, userId, rating, review } = req.body;
  try {
    const newReview = await ReviewsModel.create({ productId, userId, rating, review });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Error saving review", error });
  }
});
app.get("/api/reviews/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await ReviewsModel.find({ productId }).populate("userId", "Name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
