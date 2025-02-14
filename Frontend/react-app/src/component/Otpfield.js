// components/OtpPage.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Otpfield = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Expect signup data passed from Signup page
  const { Name, Email, Pass, Number } = location.state || {};
  
  // If state is not available, redirect back to signup
  if (!Number) {
    navigate("/Signup");
  }
  
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/send-otp", { mobile: Number });
      if (response.data.success) {
        setMessage("OTP sent successfully.");
        setOtpSent(true);
      } else {
        setMessage("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Please try again.");
    }
  };

  // Function to verify OTP and register user
  const verifyAndRegister = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }
    try {
      // Verify OTP
      const verifyResponse = await axios.post("http://localhost:3001/api/verify-otp", {
        mobile: Number,
        otp,
      });
      if (verifyResponse.data.success) {
        setMessage("OTP verified successfully.");
        // Now, register the user by calling /register endpoint
        const registerResponse = await axios.post("http://localhost:3001/register", {
          Name,
          Email,
          Pass,
          Number,
        });
        if (registerResponse.data.message === "success") {
          // Registration successful, log the user in and navigate to account page.
          const userData = { Name, Email, Number, id: registerResponse.data.id };
          // Assuming your AuthContext login function is available (you may need to import and use it)
          // login(registerResponse.data.token, userData);
          toast.success("Registration successful!");
          navigate("/account", { state: userData });
        } else {
          setMessage(registerResponse.data.message || "Registration failed.");
        }
      } else {
        setMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification or registration:", error);
      setMessage("Error during OTP verification. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "2rem auto", padding: 2, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Verify Your Mobile Number
      </Typography>
      <Typography variant="body1">
        An OTP has been sent to {Number}. Please enter the OTP below.
      </Typography>
      
      {!otpSent ? (
        <Button variant="contained" color="primary" onClick={sendOtp} sx={{ mt: 2 }}>
          Send OTP
        </Button>
      ) : (
        <>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={verifyAndRegister} fullWidth sx={{ mt: 2 }}>
            Verify OTP &amp; Register
          </Button>
        </>
      )}
      
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Otpfield;
