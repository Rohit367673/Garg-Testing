// src/App.js
import React from 'react';
import './App.css';
import './Responsive.css';
import Header from './component/Header';
import Home from './component/Home';
import Cart from './component/Cart';
import Collection from './component/Collection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './component/Login';
import Signup from './component/Signup';
import User from './component/user';
import Profile from './component/Profile';
import Order from './component/Order';
import Account from './component/Account';
import About from './component/About';
import Address from './component/Address';
import ChangePassword from './component/ChangePassword';
import { AuthProvider } from './component/AuthContext';
import Otpfield from './component/Otpfield';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  return (
    <GoogleOAuthProvider clientId="663051077642-lk27c11jh230j4vdcb6sduj5fp4jela4.apps.googleusercontent.com">
    <AuthProvider>
    
    <Router>
      <Header />
      <Toaster />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Collection' element={<Collection />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/ChangePassword' element={<ChangePassword />} />
        <Route path='/User' element={<User/>} />
        <Route path='/Profile' element={<Profile  />} />
        <Route path='/Order' element={<Order/>} />
        <Route path='/Account' element={<Account/>} />
        <Route path='/About' element={<About />} />
        <Route path='/Address' element={<Address />} />
        <Route path='/Otpfield' element={<Otpfield />} />
        
      </Routes>
    </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
