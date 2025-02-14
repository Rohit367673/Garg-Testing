import mongoose from "mongoose";
// Define a schema for each cart item
const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  imgsrc: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  selectedSize: { 
    type: String, 
    required: true 
  },
  selectedColor: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  }
}, { _id: false }); // _id: false if you don't want separate ids for items

// Define the main Cart schema that stores the user id and an array of cart items.
const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  cartItems: [cartItemSchema],
  subTotal: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

// Export the model
const CartModel= mongoose.model("Cart", cartSchema);
export default CartModel
