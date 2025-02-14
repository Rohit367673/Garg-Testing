import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  // Option 1: If you don’t need a separate id field, consider removing this and using MongoDB’s _id.
  // Option 2: If you keep it, make sure the client supplies thi
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
    required: true, // Category is mandatory for filtering
  },
});

const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;
