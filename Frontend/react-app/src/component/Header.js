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
  const cartItems = useSelector((s) => s.cart.cartItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null); // for debounce

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
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
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/product?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowDropdown(false);
      e.preventDefault();
    }
  };

  const handleSelectProduct = (product) => {
    if (product.isViewAll) {
      navigate(`/product?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/product/${product._id || product.id}`);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/">
          <img src="/Images/Logo2.png" alt="Logo" className="logo" />
        </Link>
      </div>

      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/product" className={({ isActive }) => isActive ? "active" : ""}>Products</NavLink></li>
          <li><NavLink to="/About" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
          <li>
            <NavLink to="/Cart" className="cart-link">
              <FiShoppingCart className="shoppingbag" />
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        <div className="search-container" ref={searchInputRef}>
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          <SearchRecommendation
            anchorEl={searchInputRef.current}
            recommendedProducts={
              Array.isArray(searchResults)
                ? [
                    ...searchResults,
                    {
                      id: "__view_all__",
                      name: `View all results for "${searchQuery}"`,
                      isViewAll: true,
                    },
                  ]
                : []
            }
            open={showDropdown}
            onSelectProduct={handleSelectProduct}
            searchQuery={searchQuery}
          />
        </div>

        <div className="btnval">
          {!user ? (
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          ) : (
            <Link to="/account">
              {/* Removed user name display for privacy and cleaner navbar */}
              {/* <div className="user-greeting text-gray-700">{user.Name}</div> */}
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
