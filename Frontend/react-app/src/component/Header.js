import React, { useEffect, useRef, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import { AuthContext } from "./AuthContext";

function Header() {
  const { isAuthenticated } = useContext(AuthContext);
  const Item = useSelector((state) => state.cart.cartItems);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    // Simulate a delay to ensure auth state is fully determined
    const timer = setTimeout(() => setLoading(false), 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let isHover = {
    display: show ? "block" : "none",
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="nav">
        <img src="/pic/logo3.png" alt="Logo" />
        <div className="right">
          <ul className="flex gap-12 -ml-56">
            <li>
              <NavLink to="/" className={({ isActive }) => `${isActive ? "text-orange-500" : "text-black"}`}>
                <p className="hov">Home</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/collection" className={({ isActive }) => `${isActive ? "text-orange-500" : "text-black"}`}>
                <p className="hov">Product</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Cart" className="relative cursor-pointer">
                <FiShoppingCart className=" shopingbag text-3xl opacity-80" />
                <p className="absolute w-4 h-4 rounded-full z-10 right-[-3px] bottom-[-3px] flex items-center justify-center text-[10px] bg-black text-white">
                  {Item.length}
                </p>
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="btnval mt-2">
          {!isAuthenticated && (
          <Link to="/login">  <button className="bg-white">
          <Link to="/login">     Login</Link>
            </button></Link>
          )}
        </div>
        
        <FiUser className="user" onClick={() => setShow(!show)} />
      </div>
      <Profile Hover={isHover} value={menuRef} />
    </>
  );
}

export default Header;
