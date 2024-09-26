import mongoose from "mongoose";


// User Schema
const userSchema= new mongoose.Schema({
    id:String,
    Name:String,
    Email:String,
    Number:Number,
    Pass:String,
    ProfilePic: { type: String }, 

},{timeStamps:true})
const SignupModel=mongoose.model("SignupModel",userSchema)

// Product Schema
const productSchema = new mongoose.Schema({
   id: { type: String, required: true },
    name: String,
    price: Number,
    imgsrc: String,
    quantity: Number,
    isFavorite: { type: Boolean, default: false },
  });
  
  const ProductModel = mongoose.model("Products", productSchema);
  

// Cart Schema
const cartSchema = new mongoose.Schema({
  products: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
  }],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

const CartModel = mongoose.model("cart", cartSchema);

// Export all models
export { SignupModel, ProductModel, CartModel};
