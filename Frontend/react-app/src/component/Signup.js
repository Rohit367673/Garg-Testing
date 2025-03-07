import React, { useState, useContext } from "react";
import { AiFillMail, AiOutlineKey, AiFillContacts } from "react-icons/ai";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Pass, setPassword] = useState("");
  const [Number, setNumber] = useState("");

  // OTP state for email verification
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const submitHandle = (e) => {
    e.preventDefault();
    if (!emailVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, { Name, Email, Pass, Number })
      .then((res) => {
        if (res.data.message === "success") {
          const userData = { Name, Email, Number, Pass, id: res.data.id };
          login(res.data.token, userData);
          navigate("/account", { state: userData });
          toast.success("Registration successful!");
        } else {
          console.log(res.data.message);
          toast.error(res.data.message || "Registration failed!");
        }
      })
      .catch((err) => {
      
        const errorMessage = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Registration failed!";
        toast.error(errorMessage);
      });
      
  };

  const sendOtp = async () => {
    if (!Email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/otp/send-email-otp`, { email: Email });
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/otp/verify-email-otp`, { email: Email, otp });
      toast.success(res.data.message);
      setEmailVerified(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response.data.error || "OTP verification failed.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/google-signup`, {
        token: credential,
      });
      if (res.data.message === "success") {
        const { token, user } = res.data;
        const userData = {
          Name: user.Name || "No Name",
          Email: user.Email || "No Email",
          Number: user.Number || "Not Provided",
          id: user._id,
          ProfilePic: user.ProfilePic || "default-avatar.jpg",
        };
        login(token, userData);
        navigate("/account", { state: { ...userData } });
        toast.success("Google Sign-Up successful!");
      } else {
        toast.error(res.data.message || "Google Sign-Up failed!");
      }
    } catch (error) {
      console.error("Google Sign-Up error:", error);
      toast.error("Google Sign-Up failed!");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google Sign-In failed!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="box bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={submitHandle}
      >
        <h1 className="text-center mb-6 text-3xl font-semibold">Sign Up</h1>
        <div className="input mb-4 flex items-center border-b border-gray-300">
          <FiUser className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Enter Username"
            required
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="input mb-4 flex items-center border-b border-gray-300">
  <AiFillMail className="mr-2 text-gray-600" />
  <input
    type="email"
    placeholder="Enter Email-Id"
    required
    value={Email}
    onChange={(e) => {
      setEmail(e.target.value);
      // Reset OTP verification if email changes
      setOtpSent(false);
      setEmailVerified(false);
    }}
    className="flex-1 py-2 outline-none"
  />
  {!otpSent && (
    <button type="button" onClick={sendOtp} className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
      Send OTP
    </button>
  )}
</div>
{otpSent && !emailVerified && (
  <div className="input mb-4 flex items-center border-b border-gray-300">
    <input
      type="text"
      placeholder="Enter OTP"
      required
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="flex-1 py-2 outline-none"
    />
    <button type="button" onClick={verifyOtp} className="ml-2 bg-green-500 text-white px-3 py-1 rounded">
      Verify OTP
    </button>
  </div>
)}

        <div className="input mb-4 flex items-center border-b border-gray-300">
          <AiFillContacts className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Enter Number"
            required
            value={Number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="input mb-6 flex items-center border-b border-gray-300 relative">
          <AiOutlineKey className="mr-2 text-gray-600" />
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            required
            value={Pass}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 py-2 outline-none"
          />
          <div className="eye absolute right-0 top-0 mt-3 mr-2">
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="btn w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          disabled={!emailVerified} // disable sign-up until email is verified
        >
          Sign Up
        </button>
        <p className="mt-4 text-center">
          I have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
        <div className="flex justify-center mt-6">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </div>
      </form>
    </div>
  );
}

export default Signup;
