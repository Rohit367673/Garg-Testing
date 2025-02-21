import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import SearchRecommendation from "./SearchRecommendation";

function Header() {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    // Remove artificial delay
    setLoading(false);
  }, []);

  // Close dropdown if clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products/search?query=${query}`
      );
      setSearchResults(res.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectProduct = (product) => {
    console.log("Selected product:", product);
    navigate(`/product/${product.id || product._id}`);
    setSearchQuery("");
    setShowDropdown(false);
  };

  if (loading) return null;

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/">
          <img src="./Images/Logo2.png" alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/Product" className={({ isActive }) => (isActive ? "active" : "")}>
              Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/About" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/Cart" className="cart-link">
              <FiShoppingCart className="shoppingbag" />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Right Section (Search, Login/Profile, and Mobile Toggle) */}
      <div className="nav-right">
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          <SearchRecommendation
            anchorEl={searchInputRef.current}
            recommendedProducts={searchResults}
            open={showDropdown}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        <div className="btnval">
          {!user ? (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          ) : (
            <Link to="/account">
              <div className="user-greeting text-orange-500">{user.Name}</div>
            </Link>
          )}
        </div>

        <div className="profile-icon-container" onClick={toggleProfile}>
          <FiUser className="icon-user" />
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {isProfileOpen && <Profile isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />}
      </div>
    </header>
  );
}

export default Header;
