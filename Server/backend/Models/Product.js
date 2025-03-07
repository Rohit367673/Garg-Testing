import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] },
  quantity: Number,
  description: String,
  stock: { type: String, enum: ['In Stock', 'Out of Stock'], required: true },
  color: { type: [String], required: true },
  size: { type: [String], required: true },
  Catagory: { type: String, required: true },
  productType: { type: String, required: true },
  weight: Number,
  dimensions: String,
});

const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;
