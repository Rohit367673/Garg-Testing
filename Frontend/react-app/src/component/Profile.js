import React, { useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineOrderedList, AiOutlineContacts, AiOutlineUser } from "react-icons/ai";
import {FiShoppingCart} from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Profile.css";

function Profile({ isOpen, setIsOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false); // Close dropdown after logout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    isOpen && (
      <div className="Ucontainer show" ref={dropdownRef}>
        <ul>
          <li className="Uitem">
            <Link to="/UserOrders">
              <AiOutlineOrderedList />
              <p className="Uitemp"> Orders</p>
            </Link>
          </li>
          <li className="Uitem">
            <Link to="/Cart">
              <FiShoppingCart/>
              <p className="Uitemp">Cart</p>
            </Link>
          </li>
          <li className="Uitem">
            <Link to="/Account">
              <AiOutlineUser />
              <p className="Uitemp"> Profile</p>
            </Link>
          </li>
          <li className="Uitem">
            <Link to="/Contact">
              <AiOutlineContacts />
              <p className="Uitemp cursor-pointer"> Contact Us</p>
            </Link>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )
  );
}

export default Profile;
