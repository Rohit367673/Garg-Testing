import React, { useState, useEffect, useContext } from "react";
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

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const codFee = 50;

  const totalWeightGrams = cartItems.reduce((sum, item) => {
    const itemWeight = item.weight ? Number(item.weight) : 500;
    return sum + itemWeight * item.quantity;
  }, 0);
  const totalWeightKg = totalWeightGrams / 1000;
  const finalTotal = Total + shippingCost + (paymentMethod === "COD" ? codFee : 0);

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (address.postalCode?.length === 6 && cartItems.length > 0) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/shiprocket/calculate-shipping`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                destination_pincode: address.postalCode,
                weight: totalWeightKg,
                cartItems: cartItems,
              }),
            }
          );
          const data = await response.json();
          setShippingCost(data.estimated_shipping_cost || 0);
        } catch (error) {
          console.error("Error fetching shipping cost:", error);
          setShippingCost(0);
        }
      }
    };
    fetchShippingCost();
  }, [address.postalCode, cartItems, totalWeightKg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async () => {
    if (!address.phone) {
      toast.error("Please enter a phone number.");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${address.phone}` }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(data.error || "Error sending OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${address.phone}`, code: otp }),
      });
      const data = await res.json();
      if (res.ok && data.status === "approved") {
        toast.success("Phone verified successfully!");
        setPhoneVerified(true);
      } else {
        toast.error("Incorrect OTP or verification failed.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const handleCODPayment = async () => {
    if (!user) {
      alert("User is not logged in!");
      navigate("/login");
      return;
    }
    if (!phoneVerified) {
      toast.error("Please verify your phone number first.");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }
    toast.success("COD order placed!");
  };

  const handleOnlinePayment = async () => {
    if (!user) {
      alert("User is not logged in!");
      navigate("/login");
      return;
    }
    if (!phoneVerified) {
      toast.error("Please verify your phone number first.");
      return;
    }
    if (address.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits!");
      return;
    }
    toast.success("Online payment order placed!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "COD") {
      handleCODPayment();
    } else {
      handleOnlinePayment();
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-paper">
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-form-section">
              <section className="form-section">
                <h2 className="section-title">Delivery Information</h2>
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
              </section>
              <section className="form-section">
                <h2 className="section-title">OTP Verification</h2>
                <div className="input-container">
                  {!otpSent ? (
                    <button type="button" className="btnC" onClick={handleSendOTP}>
                      SEND OTP
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button type="button" className="btnC" onClick={handleVerifyOTP}>
                        Verify
                      </button>
                    </>
                  )}
                </div>
              </section>
            </div>
            <div className="checkout-summary-section">
              <section className="form-section">
                <h2 className="section-title">Payment Method</h2>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === "ONLINE"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Online Payment
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </section>
              <section className="form-section order-summary">
                <h2 className="section-title">Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{Total}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{shippingCost}</span>
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
              </section>
              <section className="form-section">
                <button type="submit" className="place-order-btn" disabled={!phoneVerified}>
                  Place Order
                </button>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
