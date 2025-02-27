// OtpField.jsx
import React, { useState, useEffect,useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
// Import your auth instance from firebaseConfig
import { auth, } from "../firebase.Config";
import { AuthContext } from "./AuthContext";

// Import these directly from firebase/auth
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const OtpField = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { Name, Email, Pass, Number } = location.state || {};

  // If the user came here without a phone number, redirect:
  useEffect(() => {
    if (!Number) {
      navigate("/Signup");
    }
  }, [Number, navigate]);

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible", // Make it invisible for seamless user experience
        callback: (response) => {
          console.log("reCAPTCHA resolved");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        }
      });
  
      // Ensure reCAPTCHA is rendered
      window.recaptchaVerifier.render().catch((error) => {
        console.error("Error rendering reCAPTCHA:", error);
      });
    }
  
    return () => {
  
    };
  }, []);
  

  
  const formatPhoneNumber = (number) => {
    // Ensure the phone number is in E.164 format (adjust the country code if necessary)
    if (!number.startsWith("+")) {
      return `+91${number}`;
    }
    return number;
  };
  
  const sendOtp = async () => {
    try {
      setOtpSent(false);
      const appVerifier = window.recaptchaVerifier;
      const formattedNumber = formatPhoneNumber(Number); // Use formatted phone number
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
      setMessage("OTP sent successfully.");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.code, error.message);
      setMessage(`Error sending OTP: ${error.message}`);
      setOtpSent(true);
    }
  };
  
  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }
    if (!confirmationResult) {
      setMessage("OTP session expired. Please request a new OTP.");
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      // Optionally, you can grab the firebase user data if needed:
      const firebaseUser = result.user;
      
      // Prepare the signup data; you might want to include firebaseUser.uid if needed
      const signupData = { Name, Email, Pass, Number, firebaseUid: firebaseUser.uid };
      
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, signupData);
      if (res.data.success) {
        // Make sure your backend returns a token and user data
        const { token, user } = res.data;
        // Update your authentication context just like in your Google flow
        login(token, user);
        navigate("/Account", { state: { ...user } });
        toast.success("Registration successful!");
      } else {
        toast.error("Registration failed on the backend.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Invalid OTP. Please try again.");
    }
    
  }
  

  return (
    <Box sx={{ maxWidth: 400, margin: "2rem auto", padding: 2, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Verify Your Mobile Number
      </Typography>
      <Typography variant="body1">An OTP will be sent to {Number}.</Typography>

      {!otpSent ? (
        <>
         
          <div id="recaptcha-container"></div>

          <Button variant="contained" color="primary" onClick={sendOtp} sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={verifyOtp} fullWidth sx={{ mt: 2 }}>
            Verify OTP
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

export default OtpField;
