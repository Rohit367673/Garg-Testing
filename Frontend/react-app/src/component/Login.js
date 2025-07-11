import React, { useState, useContext } from "react";
import { AiFillMail, AiOutlineKey } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [Email, setEmail] = useState("");
  const [Pass, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginsubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, { Email, Pass },)
      .then((res) => {
        if (res.data.message === "success") {
          // Ensure ProfilePic is always set
          const userWithPic = {
            ...res.data.user,
            ProfilePic: res.data.user.ProfilePic || "default-avatar.jpg",
          };
          navigate("/Account", { state: userWithPic });
          login(res.data.token, userWithPic);
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError("Something went wrong. Please try again.");
        console.error(err);
      });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/google-signup`, {
        token: credential,
      });
      if (res.data.message === "success") {
        const { token, user } = res.data;
        const userData = {
          Name: user.Name,
          Email: user.Email,
          Number: user.Number || "",
          id: user._id,
          ProfilePic: user.ProfilePic || "",
        };
        login(token, userData);
        navigate("/account", {state: userData});
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-2">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 tracking-tight">Sign in to your account</h1>
        <form onSubmit={loginsubmitHandler} className="space-y-6">
          <div className="relative">
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
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label htmlFor="email" className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 bg-white/80 px-1">
              Email address
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
              autoComplete="current-password"
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
          <button type="submit" className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold text-lg shadow hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-700">
            Sign In
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 font-medium">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            width="260"
            shape="pill"
            theme="filled_black"
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <span className="text-gray-700">
            Don&apos;t have an account?{' '}
            <Link to="/Signup" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
          </span>
          <span className="text-gray-700">
            <Link to="/ChangePassword" className="text-blue-600 hover:underline font-semibold">Forgot Password?</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
