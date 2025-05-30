import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] },
  
  description: String,
  productType: { 
    type: String, 
    required: true,
    default: "Casual",
    enum: ["Casual", "Formal", "Traditional", "Party Wear", "Summer", "Winter"]
  },
  color: { type: [String], required: true },
  size: { type: [String], required: true },
  Catagory: { type: String, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  outSizes:    { type: [String], default: [] },
  outColors:   { type: [String], default: [] },
});

// Add a pre-save middleware to ensure productType is always set
productSchema.pre('save', function(next) {
  if (!this.productType) {
    this.productType = "Casual";
  }
  next();
});

productSchema.index({ name: "text", category: "text", brand: "text" });
const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;
