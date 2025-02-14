import mongoose from "mongoose";

// Define an Address Schema
const AddressSchema = new mongoose.Schema({
  addressId: { type: mongoose.Schema.Types.ObjectId, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  notes: String,
});

// Define the Order Schema
const OrderSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    cartId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Cart" 
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String },
        imgsrc: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        selectedSize: { type: String },
        selectedColor: { type: String },
      }
    ],
    addressInfo: { 
      type: AddressSchema, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      default: "Unpaid" 
    },
    orderStatus: { 
      type: String, 
      default: "Pending" 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    razorpayOrderId: { 
      type: String,
    },
    orderDate: { 
      type: Date, 
      default: Date.now 
    },
    paymentId: { type: String },
    payerId: { type: String },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);
export default OrderModel;
