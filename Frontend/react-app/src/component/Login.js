import React, { useState, useContext } from "react";
import "./Login.css";
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
      .post("http://localhost:3001/login", { Email, Pass },)
      .then((res) => {
        if (res.data.message === "success") {
    
          navigate("/Account", { state: res.data.user });
          
          login(res.data.token, res.data.user);
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
      console.log("Decoded Google User:", decoded);

      const res = await axios.post("http://localhost:3001/google-signup", {
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
    console.log('Google Sign-In was unsuccessful.');
    toast.error("Google Sign-In failed!");
  };
  return (
    <>

    <form className="box" onSubmit={loginsubmitHandler}>
    <h1 className="text-center mb-10 text-5xl">Login</h1>
    <div className="input">
      <AiFillMail />
      <input
        type="email"
        placeholder="Enter Email-Id"
        required
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="input">
      <AiOutlineKey />
      <input
        type={show ? "text" : "password"}
        placeholder="Enter Password"
        required
        value={Pass}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="eye -mt-8">
        <button type="button" onClick={() => setShow(!show)}>
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
    {error && <p style={{ color: "red", marginLeft: "7rem", marginTop: "-1rem" }}>{error}</p>}
    <button type="submit" className="btn">Login</button>
    <p className="ml-32">
      Don't have an account? <Link to="/Signup">Sign Up</Link>
      <p className="ml-8 mt-1">Or <Link to="/ChangePassword">Forgot Password?</Link></p>
    </p>
    
     <div className="flex justify-center mt-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>
  </form>
  </>

  );
}

export default Login;
