import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: String,
  price: Number,
  images: { type: [String] },
  quantity: Number,
  description: { type: String },
  stock: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
  },
  color: { type: [String], required: true },
  size: { type: [String], required: true },
  category: {
    type: String,
    required: true,
  },
});

const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;
