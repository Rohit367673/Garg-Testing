import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { initializeCart } from "../redux/CartSlice.js";
import toast from "react-hot-toast";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, Total, cartId } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure cartId is initialized
  if (!cartId) {
    dispatch(initializeCart());
  }

  // Address state
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const codFee = 50; // COD fee if applicable
  const finalTotal = Total + (paymentMethod === "COD" ? codFee : 0);

  // Razorpay Key (should be set in your .env file)
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Create Order API function
  const createOrder = async (paymentMethodType) => {
    const userId = user.id;

    const adjustedCartItems = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      imgsrc: item.imgsrc,
      price: item.price,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
    }));

    const payload = {
      userId,
      cartId,
      cartItems: adjustedCartItems,
      totalAmount: paymentMethodType === "COD" ? Total + codFee : Total,
      paymentMethod: paymentMethodType,
      addressInfo: { ...address },
    };

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    return response.json();
  };

  // Cash on Delivery Payment
  const handleCODPayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }

    try {
      const orderData = await createOrder("COD");
      if (!orderData.orderId) throw new Error("Order creation failed");
      toast.success("COD order placed successfully!");
    } catch (error) {
      toast.error("Error placing COD order. Please try again.");
      console.error(error);
    }
  };

  // Razorpay (Online) Payment
  const handleRazorpayPayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }

    try {
      const orderData = await createOrder("Razorpay");
      if (!orderData.orderId) throw new Error("Order creation failed");

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.orderId,
        handler: (response) => {
          toast.success("Payment successful!");
          console.log("Razorpay response:", response);
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
      toast.error("Error creating order. Please try again.");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    paymentMethod === "COD" ? handleCODPayment() : handleRazorpayPayment();
  };

  return (
    <div className="checkout-container">
      <div className="checkout-paper">
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit}>
          {/* Delivery Information */}
          <div className="section">
            <h2>Delivery Information</h2>
            <div className="input-container">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "tel" },
                { label: "Street", name: "street", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "Postal Code", name: "postalCode", type: "text" },
                { label: "State", name: "state", type: "text" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={address[field.name]}
                  onChange={handleChange}
                  required
                />
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="section">
            <h2>Payment Method</h2>
            <div className="radio-container mt-4">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                Online Payment
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="section order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{Total}</span>
            </div>
            {paymentMethod === "COD" && (
              <div className="summary-row">
                <span>COD Fee:</span>
                <span>₹{codFee}</span>
              </div>
            )}
            <hr />
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="section">
            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
