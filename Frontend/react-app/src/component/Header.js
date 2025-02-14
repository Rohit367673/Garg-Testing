import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import { AuthContext } from "./AuthContext";

function Header() {
  const { user } = useContext(AuthContext);
  const Item = useSelector((state) => state.cart.cartItems);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for profile dropdown

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="nav">
        <Link to="/">
          <img src="./Images/Logo2.png" alt="Logo" className="logo" />
        </Link>

        {/* Navigation Menu */}
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <ul className="menu-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "text-orange-500" : "text-black")}
              >
                <p className="hov">Home</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Collection"
                className={({ isActive }) => (isActive ? "text-orange-500" : "text-black")}
              >
                <p className="hov">Product</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/About"
                className={({ isActive }) => (isActive ? "text-orange-500" : "text-black")}
              >
                <p className="hov">About</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Cart" className="relative cursor-pointer">
                <FiShoppingCart className="shoppingbag text-3xl opacity-80" />
                <p className="absolute w-4 h-4 rounded-full z-10 right-[-3px] bottom-[-3px] flex items-center justify-center text-[10px] bg-black text-white">
                  {Item.length}
                </p>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right Section (Profile & Login) */}
        <div className="nav-right">
          <div className="btnval">
            {!user ? (
              <Link to="/login">
                <button className="bg-white"><Link to="/login">Login</Link></button>
              </Link>
            ) : (
              <Link to="/account">
                <h1 className="profile-button text-xl text-orange-500 mt-1">
                  Welcome, {user.Name}
                </h1>
              </Link>
            )}
          </div>

          {/* Profile Button */}
          <div className="profile-icon-container" onClick={toggleProfile}>
            <FiUser className="icon-user" />
          </div>

          {/* Profile Dropdown (conditionally rendered) */}
          {isProfileOpen && <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />}

          {/* Mobile Menu Button */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
