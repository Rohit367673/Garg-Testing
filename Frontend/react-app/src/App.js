import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./component/Header";
import Home from "./component/Home";
import Cart from "./component/Cart";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Profile from "./component/Profile";
import Account from "./component/Account";
import About from "./component/About";
import Address from "./component/Address";
import ChangePassword from "./component/ChangePassword";
import { AuthProvider } from "./component/AuthContext";
import Otpfield from "./component/Otpfield";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Contact from "./component/Contact";

// Admin Panel Components
import AdminLogin from "./Admin/AdminLogin";
import Sidebar from "./Admin/Sidebar";
import ProtectedRoute from "./Admin/ProtectedRoute";
import AddProduct from "./Admin/AddProduct";
import AdminOrders from "./Admin/AdminOrders";
import Products from "./Admin/Products";
import DefaultAdminDashboard from "./Admin/DefaultAdminDashboard";
import ProductDetails from "./component/ProductDetails";
import CheckoutPage from "./component/CheckoutPage";
import UserOrders from "./component/UserOrders";

// Import our new ProtectedUserRoute component
import ProtectedUserRoute from "./component/ProtectedUserRoute";
import AdminSlider from "./Admin/AdminSlider";

import Product from "./component/Product";
import SearchRecommendation from "./component/SearchRecommendation";
import TermsAndPolicy from "./component/TermsPolicy";
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import ChatbotConfig from './component/ChatbotConfig';
import ActionProvider from './component/ChatbotActionProvider';
import MessageParser from './component/ChatbotMessageParser';
import ChatIcon from '@mui/icons-material/Chat';

function App() {
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeMsg, setConciergeMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "concierge", text: "Welcome to Garg Exclusive Concierge! How can we assist you today?" },
  ]);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "EN");
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "true") setCookieConsent(true);
  }, []);

  const handleAcceptCookies = () => {
    setCookieConsent(true);
    localStorage.setItem("cookieConsent", "true");
  };

  const handleSendConcierge = () => {
    if (conciergeMsg.trim()) {
      setChatHistory([...chatHistory, { sender: "user", text: conciergeMsg }]);
      setConciergeMsg("");
      // Simulate concierge response
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "concierge", text: "Thank you for your message! Our team will get back to you shortly." },
        ]);
      }, 1200);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Header />
          <Toaster />
          {/* Floating Chatbot Button */}
          <button
            onClick={() => setChatbotOpen(true)}
            style={{
              position: 'fixed',
              bottom: 110,
              right: 32,
              zIndex: 1200,
              background: '#fff',
              color: '#333',
              border: '2px solid #333',
              borderRadius: '50%',
              width: 60,
              height: 60,
              fontSize: 32,
              cursor: 'pointer',
              display: chatbotOpen ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(34,34,34,0.10)',
              transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
            }}
            aria-label="Open Chatbot"
          >
            <ChatIcon style={{ fontSize: 32, color: '#333', transition: 'color 0.2s' }} />
          </button>
          {/* Chatbot Modal */}
          {chatbotOpen && (
            <div
              style={{
                position: 'fixed',
                bottom: 110,
                right: 32,
                zIndex: 1300,
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(34,34,34,0.18)',
                width: 370,
                maxWidth: '95vw',
                minHeight: 480,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '2px solid #222',
              }}
            >
              {/* Header */}
              <div style={{
                background: '#222',
                color: '#fff',
                padding: '1.1rem 1.5rem 1.1rem 1.5rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                position: 'relative', // <-- add this
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottom: '1px solid #eee',
              }}>
                Garg Assistant
                <button
                  onClick={() => setChatbotOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: 24,
                    cursor: 'pointer',
                    position: 'absolute',
                    right: 4, // <-- move even closer to edge
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: 0,
                  }}
                  aria-label="Close Chatbot"
                >
                  ×
                </button>
              </div>
              {/* Chatbot */}
              <div style={{ flex: 1, background: '#faf9f6', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <style>{`
                  .react-chatbot-kit-chat-container {
                    border-radius: 0 0 20px 20px !important;
                    box-shadow: none !important;
                    background: #faf9f6 !important;
                    border: none !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }
                  .react-chatbot-kit-chat-header {
                    display: none !important;
                  }
                  .react-chatbot-kit-chat-message-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    border-radius: 0 0 20px 20px !important;
                    background: #faf9f6 !important;
                    padding: 18px 18px 0 18px !important;
                    margin: 0 !important;
                    min-height: 220px !important;
                  }
                  .react-chatbot-kit-chat-bot-message {
                    background: #222 !important;
                    color: #fff !important;
                    font-family: 'Inter', sans-serif !important;
                    border-radius: 12px !important;
                    margin-bottom: 10px !important;
                    max-width: 100% !important;
                    padding: 12px 16px !important;
                    font-size: 1rem !important;
                  }
                  .react-chatbot-kit-user-chat-message {
                    background: #fff !important;
                    color: #222 !important;
                    border: 1px solid #222 !important;
                    font-family: 'Inter', sans-serif !important;
                    border-radius: 12px !important;
                    margin-bottom: 10px !important;
                    max-width: 100% !important;
                    padding: 12px 16px !important;
                    font-size: 1rem !important;
                  }
                  .react-chatbot-kit-chat-input-form {
                    border-top: 1px solid #eee !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #fff !important;
                    border-bottom-left-radius: 20px !important;
                    border-bottom-right-radius: 20px !important;
                    display: flex !important;
                    align-items: center !important;
                  }
                  .react-chatbot-kit-chat-input {
                    border-radius: 8px !important;
                    font-family: 'Inter', sans-serif !important;
                    font-size: 1rem !important;
                    padding: 12px 16px !important;
                    margin: 12px 0 12px 12px !important;
                    border: 1px solid #ccc !important;
                    flex: 1 1 auto !important;
                    background: #fff !important;
                  }
                  .react-chatbot-kit-chat-btn-send {
                    background: #222 !important;
                    color: #fff !important;
                    border-radius: 8px !important;
                    font-weight: 700 !important;
                    margin: 0 12px 0 8px !important;
                    min-width: 44px !important;
                    min-height: 44px !important;
                    font-size: 1.3rem !important;
                    transition: background 0.2s;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                  }
                  .react-chatbot-kit-chat-btn-send:hover {
                    background: #555 !important;
                    color: #fff !important;
                  }
                  .react-chatbot-kit-chat-input::placeholder {
                    color: #888 !important;
                    opacity: 1 !important;
                  }
                  .react-chatbot-kit-chat-input-form > * {
                    margin: 0 !important;
                  }
                  .react-chatbot-kit-chat-bot-avatar-container, .react-chatbot-kit-user-avatar-container {
                    display: none !important;
                  }
                  .react-chatbot-kit-chat-bot-message, .react-chatbot-kit-user-chat-message {
                    box-shadow: 0 2px 8px rgba(34,34,34,0.06) !important;
                  }
                  .react-chatbot-kit-widget-container > div > button {
                    width: 100% !important;
                    margin: 0 0 10px 0 !important;
                    border-radius: 8px !important;
                    font-size: 1rem !important;
                    font-weight: 700 !important;
                    padding: 12px 0 !important;
                    background: #222 !important;
                    color: #fff !important;
                    border: 1px solid #222 !important;
                    transition: background 0.2s, color 0.2s;
                  }
                  .react-chatbot-kit-widget-container > div > button:hover {
                    background: #555 !important;
                    color: #fff !important;
                    border: 1px solid #555 !important;
                  }
                  .react-chatbot-kit-widget-container > div {
                    width: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }
                  .react-chatbot-kit-widget-container {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }
                `}</style>
                <Chatbot
                  config={ChatbotConfig}
                  actionProvider={ActionProvider}
                  messageParser={MessageParser}
                  placeholderText="Type your question..."
                  headerText=""
                  disableScrollToBottom={false}
                />
              </div>
            </div>
          )}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/Product" element={<Product/>} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Otpfield" element={<Otpfield/>}/>
            <Route path="/SearchRecommendation" element={<SearchRecommendation/>}/>
            <Route path="/TermsPolicy" element={<TermsAndPolicy/>}/>

            {/* Protected User Routes */}
            <Route path="/Cart" element={<ProtectedUserRoute element={Cart} />} />
            <Route path="/Profile" element={<ProtectedUserRoute element={Profile} />} />
            <Route path="/Account" element={<ProtectedUserRoute element={Account} />} />
            <Route path="/UserOrders" element={<ProtectedUserRoute element={UserOrders} />} />
            <Route path="/Address" element={<ProtectedUserRoute element={Address} />} />
            <Route path="/ChangePassword" element={<ProtectedUserRoute element={ChangePassword} />} />
            <Route path="/Checkout" element={<ProtectedUserRoute element={CheckoutPage} />} />

            {/* Admin Login and Protected Admin Routes */}
            <Route path="/Admin/Login" element={<AdminLogin />} />
            <Route
              path="/Admin/*"
              element={<ProtectedRoute adminRequired={true} element={<Sidebar />} />}
            >
              <Route index element={<DefaultAdminDashboard />} />
              <Route path="AddProduct" element={<AddProduct />} />
              <Route path="AdminOrders" element={<AdminOrders />} />
              <Route path="Products" element={<Products />} />
              <Route path="Slider" element={<AdminSlider/>} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#222",
            color: "#fff",
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            boxShadow: "0 -2px 16px rgba(34,34,34,0.12)",
          }}
        >
          <span style={{ marginRight: 16 }}>
            We use cookies to enhance your experience. By continuing, you agree to our <a href="/privacy-policy" style={{ color: "#bfa76a", textDecoration: "underline" }}>Privacy Policy</a>.
          </span>
          <button
            onClick={handleAcceptCookies}
            style={{
              background: "#bfa76a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.5em 1.5em",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              cursor: "pointer",
              marginLeft: 16,
            }}
          >
            Accept
          </button>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
