import React from "react";
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

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Header />
          <Toaster />
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
    </GoogleOAuthProvider>
  );
}

export default App;
