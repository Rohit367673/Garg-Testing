import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; 
import { initializeCart } from "../redux/CartSlice.js"; // Import initializeCart action
import "./CheckoutPage.css";
import Footer from "./Footer.js";

const CheckoutPage = () => {
  const { cartItems, Total, cartId } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch(); // To dispatch initializeCart action
  const navigate = useNavigate();

  // Initialize the cart if cartId is not set
  if (!cartId) {
    dispatch(initializeCart());
  }

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const RAZORPAY_KEY = 'rzp_test_cqRGqNXYhc4b3x';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      alert("User is not logged in!");
      navigate("/login");
      return;
    }

    const userId = user.id;

    const adjustedCartItems = cartItems.map(item => ({
        productId: item.productId,                     // product id
      productName: item.productName,   // product name
      imgsrc: item.imgsrc,             // product image URL
      price: item.price,               // product price
      selectedSize: item.selectedSize, // selected size (if any)
      selectedColor: item.selectedColor, // selected color (if any)
      quantity: item.quantity,         // quantity ordered
    }));
    
    

    try {
      const response = await fetch("http://localhost:3001/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartId, // Include cartId here
          cartItems: adjustedCartItems,
          totalAmount: Total,
          paymentMethod: "Razorpay",
          addressInfo: {
            name: address.name,
            email: address.email,
            phone: address.phone,
            street: address.street,
            city: address.city,
            postalCode: address.postalCode, // Rename to postalCode to match schema
            state: address.state,
          },
        }),
      });

      const orderData = await response.json();
      if (!orderData.orderId) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.orderId,
        handler: function (response) {
          alert("Payment successful!");
          console.log("Payment successful!", response);
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Error creating order. Please try again.");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRazorpayPayment();
  };

  return (
    <>
    <div className="checkout-page">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Please add items first.</p>
      ) : (
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          <form onSubmit={handleSubmit}>
            {["name", "email", "phone", "street", "city", "postalCode", "state"].map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={address[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <h2>Order Summary</h2>
            <p>Total: ₹{Total}</p>

            <button type="submit" className="submit-btn">Proceed to Payment</button>
          </form>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default CheckoutPage;
