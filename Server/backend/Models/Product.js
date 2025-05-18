import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] },
  
  description: String,
  
  color: { type: [String], required: true },
  size: { type: [String], required: true },
  Catagory: { type: String, required: true },
  brand:{type:String,required:true},
  quantity: { type: Number, required: true },
    outSizes:    { type: [String], default: [] },
  outColors:   { type: [String], default: [] },

  


 
});

const ProductModel = mongoose.model("Products", productSchema);
export default ProductModel;
