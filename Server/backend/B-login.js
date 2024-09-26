import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import{ SignupModel,ProductModel,CartModel} from "../backend/SignupModeling.js";
import { OAuth2Client } from "google-auth-library";


import dotenv from 'dotenv';

dotenv.config(); // Loads environment variables from .env file




const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.use(cors());
app.use(bodyParser.json());
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // or use your GOOGLE_CLIENT_ID directly

mongoose
  .connect(
    "mongodb+srv://rohit673367:Rohit367673@cluster0.ixnakmg.mongodb.net/signup"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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
  

  const defaultProducts = [
    {
     
      name: "Whey Protein",
      price: 1999,
      imgsrc: "/pic/mb-whey.webp",
      quantity: 10,
    },
    {
   
      name: "Pre Workout",
      price: 599,
      imgsrc: "/pic/prd_2241268-MuscleBlaze-PRE-Workout-200-0.webp",
      quantity: 20,
    },
    {

      name: "Creatine Monohydrate",
      price: 699,
      imgsrc: "/pic/prd_1484675-MuscleBlaze-Creatine-Monohydrate-0.55-lb-Unflavoured_o.jpg",
      quantity: 15,
    },
  ];
  
  const initializeProducts = async () => {
  try {
    const existingProducts = await ProductModel.find({});
    console.log("Existing products:", existingProducts);

    if (existingProducts.length === 0) {
      await ProductModel.insertMany(defaultProducts);
      console.log("Products added to the database");
    } else {
      console.log("Products already exist");
    }
  } catch (error) {
    console.error("Error initializing products:", error);
  }
};
 
  // User registration
  app.post("/register", async (req, res) => {
    try {
      const { Name, Email, Number, Pass } = req.body;
      const hashedPassword = await bcrypt.hash(Pass, 10);
      const user = await SignupModel.create({ Name, Email, Number, Pass: hashedPassword });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).send({ message: "success", id: user._id, token });
    } catch (error) {
      res.status(500).send({ message: "Registration failed!", error });
    }
  });
  
  // User login
  app.post("/login", async (req, res) => {
    try {
      const { Email, Pass } = req.body;
      const user = await SignupModel.findOne({ Email });
      if (!user) {
        return res.status(404).json({ message: "No record found" });
      }
      const match = await bcrypt.compare(Pass, user.Pass);
      if (match) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        return res.send({ message: "success", token, user });
      }
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Verify token
  app.get("/verifyToken", isLoggedIn, (req, res) => {
    res.status(200).json({ message: "success" });
  });
  
  // Update user profile
  app.post('/updateProfile', isLoggedIn, async (req, res) => {
    try {
      const { id, Name, Email, Number, Pass } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ID:", id);
        return res.status(400).send({ message: 'Invalid user ID' });
      }
  
      const user = await SignupModel.findById(id);
  
      if (!user) {
        console.log("User not found for ID:", id);
        return res.status(404).send({ message: 'User not found' });
      }
  
      user.Name = Name;
      user.Email = Email;
      user.Number = Number;
  
      if (Pass) {
        user.Pass = await bcrypt.hash(Pass, 10);
      }
  
      await user.save();
  
      console.log("Profile updated successfully for ID:", id);
      res.send({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).send({ message: 'Server error' });
    }
  });
  
  // Change password
  app.post('/change-password', async (req, res) => {
    const { Email, currentPassword, newPassword } = req.body;
  
    try {
      const user = await SignupModel.findOne({ Email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.Pass);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
  
      user.Pass = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.post("/addCart", async (req, res) => {
  const { id, name, price, imgsrc, quantity } = req.body;
  console.log('Received product for cart:', { id, name, price, imgsrc, quantity });
  try {

    let cart = await CartModel.findOne();

    if (!cart) {
   
      cart = new CartModel({
        products: [
          {
            id,
            name,
            price,
            imgsrc,
            quantity,
          },
        ],
        totalAmount: price * quantity,
      });
    } else {

      const existingProductIndex = cart.products.findIndex(
        (product) => product.name === name
      );

      if (existingProductIndex !== -1) {
       
        cart.products[existingProductIndex].quantity += quantity;
      } else {
       
        cart.products.push({
          id,
          name,
          price,
          imgsrc,
          quantity,
        });
      }

   
      cart.totalAmount += price * quantity;
    }

    await cart.save();
    res.status(201).json({ message: "Order added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order", error });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    // Convert _id to id in response
    const formattedProducts = products.map(product => ({
      id: product._id.toString(), // Convert ObjectId to string
      name: product.name,
      price: product.price,
      imgsrc: product.imgsrc,
      quantity: product.quantity
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
});


app.post("/google-signup", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the correct client ID
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await SignupModel.findOne({ Email: email });
    if (!user) {
      user = new SignupModel({
        Name: name,
        Email: email,
        ProfilePic: picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "success", token: jwtToken, user });
  } catch (error) {
    console.error("Google Sign-Up error:", error);
    res.status(500).json({ message: "Google Sign-Up failed", error: error.message });
  }
});



  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });