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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandle = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!emailVerified) {
      setError("Please verify your email before signing up.");
      toast.error("Please verify your email before signing up.");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, { Name, Email, Pass, Number })
      .then((res) => {
        if (res.data.message === "success") {
          const userData = { Name, Email, Number, Pass, id: res.data.id, ProfilePic: "default-avatar.jpg" };
          login(res.data.token, userData);
          navigate("/account", { state: userData });
          setSuccess("Registration successful!");
          toast.success("Registration successful!");
        } else {
          setError(res.data.message || "Registration failed!");
          toast.error(res.data.message || "Registration failed!");
        }
      })
      .catch((err) => {
        const errorMessage = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Registration failed!";
        setError(errorMessage);
        toast.error(errorMessage);
      });
  };

  const sendOtp = async () => {
    setError("");
    setSuccess("");
    if (!Email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/otp/send-email-otp`, { email: Email });
      setSuccess(res.data.message);
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (error) {
      setError("Failed to send OTP.");
      toast.error("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/otp/verify-email-otp`, { email: Email, otp });
      setSuccess(res.data.message);
      setEmailVerified(true);
      toast.success(res.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "OTP verification failed.");
      toast.error(error.response?.data?.error || "OTP verification failed.");
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
      toast.error("Google Sign-Up failed!");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google Sign-In failed!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-2">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight">Create your account</h1>
        <form onSubmit={submitHandle} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              <FiUser />
            </span>
            <input
              type="text"
              id="name"
              className="peer pl-11 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-700 bg-white/90 text-gray-900 placeholder-transparent transition"
              placeholder="Username"
              required
              value={Name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
            />
            <label htmlFor="name" className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white/80 px-1">
              Username
            </label>
          </div>
          <div className="relative flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                <AiFillMail />
              </span>
              <input
                type="email"
                id="email"
                className="peer pl-11 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-700 bg-white/90 text-gray-900 placeholder-transparent transition"
                placeholder="Email address"
                required
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setEmailVerified(false);
                }}
                autoComplete="email"
              />
              <label htmlFor="email" className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white/80 px-1">
                Email address
              </label>
            </div>
            {!otpSent && (
              <button type="button" onClick={sendOtp} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all whitespace-nowrap">
                Send OTP
              </button>
            )}
          </div>
          {otpSent && !emailVerified && (
            <div className="relative flex gap-2">
              <input
                type="text"
                id="otp"
                className="peer pl-4 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-700 bg-white/90 text-gray-900 placeholder-gray-400 transition"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoComplete="one-time-code"
              />
              <button type="button" onClick={verifyOtp} className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all whitespace-nowrap">
                Verify OTP
              </button>
            </div>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              <AiFillContacts />
            </span>
            <input
              type="text"
              id="number"
              className="peer pl-11 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-700 bg-white/90 text-gray-900 placeholder-transparent transition"
              placeholder="Phone Number"
              required
              value={Number}
              onChange={(e) => setNumber(e.target.value)}
              autoComplete="tel"
            />
            <label htmlFor="number" className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white/80 px-1">
              Phone Number
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              <AiOutlineKey />
            </span>
            <input
              type={show ? "text" : "password"}
              id="password"
              className="peer pl-11 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-700 bg-white/90 text-gray-900 placeholder-transparent transition"
              placeholder="Password"
              required
              value={Pass}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <label htmlFor="password" className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white/80 px-1">
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl focus:outline-none"
              onClick={() => setShow(!show)}
              tabIndex={-1}
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded px-3 py-2 animate-fade-in">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded px-3 py-2 animate-fade-in">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold text-lg shadow hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-700"
            disabled={!emailVerified}
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 font-medium">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} width="260" shape="pill" theme="filled_black" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <span className="text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
