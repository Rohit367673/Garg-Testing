import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import Footer from "./Footer";
import { AiOutlineEdit, AiOutlineOrderedList, AiOutlineUser, AiOutlineLock, AiOutlineHome } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import "./Profile.css";

function Account() {
  const { user } = useContext(AuthContext);
  const imageUploader = useRef(null);
  const location = useLocation();

  // Use AuthContext user as primary, fallback to location.state
  const userData = user || location.state || {};

  const [formValues, setFormValues] = useState({
    Name: userData.Name || "",
    Email: userData.Email || "",
    birthday: userData.birthday || "Birthday",
    Number: userData.Number || "",
    id: userData.id || "",
    photo: userData.ProfilePic || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.ProfilePic || formValues.photo || "/Images/default-avatar.png");
  const [recentOrders, setRecentOrders] = useState([]);

  // Profile completion logic
  const completionFields = [
    { label: 'Name', value: !!formValues.Name },
    { label: 'Email', value: !!formValues.Email },
    { label: 'Phone', value: !!formValues.Number },
    { label: 'Avatar', value: !!profilePic && profilePic !== "default-avatar.jpg" },
    { label: 'Birthday', value: !!formValues.birthday && formValues.birthday !== "Birthday" },
  ];
  const completedCount = completionFields.filter(f => f.value).length;
  const profileCompletion = Math.round((completedCount / completionFields.length) * 100);

  useEffect(() => {
    if (userData) {
      setFormValues((prevValues) => ({
        ...prevValues,
        Name: userData.Name || prevValues.Name,
        Email: userData.Email || prevValues.Email,
        Number: userData.Number || prevValues.Number,
        id: userData.id || prevValues.id,
        photo: userData.ProfilePic || prevValues.photo,
        birthday: userData.birthday || prevValues.birthday,
      }));
    }
    // Fetch recent orders (simulate or connect to backend)
    // For now, use placeholder data
    setRecentOrders([
      // Example order (uncomment to show a real order)
      // { id: '123', product: 'T-shirt', date: '2024-06-01', status: 'Delivered', image: '/Images/Catlog-Boys-kids-wear.jpg' },
    ]);
    // eslint-disable-next-line
  }, [userData]);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    const token = localStorage.getItem("token");
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/updateProfile`, { ...formValues, ProfilePic: profilePic }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Optionally update context/localStorage here
      })
      .catch((error) => {
        // Optionally show error feedback
      });
  };

  // Quick actions
  const quickActions = [
    { icon: <AiOutlineOrderedList />, label: "Orders", link: "/UserOrders" },
    { icon: <FiShoppingCart />, label: "Cart", link: "/Cart" },
    { icon: <AiOutlineUser />, label: "Products", link: "/Product" },
  ];

  return (
    <>
      <div className="profile-modal-glass" style={{ maxWidth: 480, margin: '2.5rem auto' }}>
        {/* Hero Card */}
        <div className="profile-hero-card animate-fade-in">
          <div
            className="profile-avatar-container"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
            onClick={() => isEditing && imageUploader.current.click()}
            tabIndex={0}
            aria-label="Edit avatar"
            style={{ cursor: isEditing ? "pointer" : "default" }}
          >
            <img
              src={profilePic && profilePic !== "default-avatar.jpg" ? profilePic : "/Images/default-avatar.png"}
              alt="Avatar"
              className={`profile-avatar ${avatarHover && isEditing ? "profile-avatar-hover" : ""}`}
            />
            {isEditing && (
              <div className="profile-avatar-edit-overlay">
                <AiOutlineEdit size={22} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={imageUploader}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
          <div className="profile-info">
            {isEditing ? (
              <input
                className="profile-name-input"
                name="Name"
                value={formValues.Name}
                onChange={handleChange}
                autoFocus
              />
            ) : (
              <div className="profile-name-glow">{formValues.Name}</div>
            )}
            <div className="profile-badges">
              <span className="profile-badge">{formValues.Email}</span>
              {formValues.Number && <span className="profile-badge">{formValues.Number}</span>}
              {isEditing ? (
                <input
                  className="profile-badge"
                  type="date"
                  name="birthday"
                  value={formValues.birthday !== 'Birthday' ? formValues.birthday : ''}
                  onChange={handleChange}
                  style={{ border: 'none', background: 'transparent', fontSize: '0.95rem', fontWeight: 500, color: '#333', borderRadius: 999, padding: '0.3em 1em', minWidth: 120 }}
                />
              ) : (
                formValues.birthday && formValues.birthday !== 'Birthday' && (
                  <span className="profile-badge">{new Date(formValues.birthday).toLocaleDateString()}</span>
                )
              )}
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="profile-edit-btn" onClick={handleEditClick}>
                  <AiOutlineEdit size={18} /> Edit Profile
                </button>
              ) : (
                <>
                  <button className="profile-save-btn" onClick={handleSaveClick}>Save</button>
                  <button className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Profile Completion Progress */}
        <div style={{ width: '100%', margin: '0.5rem 0 1.2rem 0' }}>
          <div style={{ fontSize: '0.95rem', color: '#888', marginBottom: 4 }}>Profile Completion</div>
          <div style={{ background: '#eee', borderRadius: 8, height: 8, width: '100%' }}>
            <div style={{ width: `${profileCompletion}%`, background: '#bfa76a', height: 8, borderRadius: 8, transition: 'width 0.4s' }}></div>
          </div>
          <div style={{ fontSize: '0.92rem', color: '#bfa76a', marginTop: 2, textAlign: 'right' }}>{profileCompletion}%</div>
        </div>
        {/* Quick Actions */}
        <div className="profile-quick-actions animate-fade-in">
          {quickActions.map((action, idx) => (
            <Link to={action.link} key={action.label} className="profile-quick-action" tabIndex={0} aria-label={action.label}>
              <div className="profile-quick-icon">{action.icon}</div>
              <div className="profile-quick-label">{action.label}</div>
            </Link>
          ))}
        </div>
        {/* Recent Orders/Activity */}
        <div className="profile-recent-card animate-fade-in">
          <div className="profile-recent-title">Recent Orders</div>
          {recentOrders.length === 0 ? (
            <div className="profile-recent-placeholder">No recent orders yet.</div>
          ) : (
            <ul style={{ width: '100%' }}>
              {recentOrders.map((order) => (
                <li key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src={order.image} alt={order.product} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#f3f3f3' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{order.product}</div>
                    <div style={{ fontSize: '0.92rem', color: '#888' }}>{order.date}</div>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: order.status === 'Delivered' ? '#1cbf73' : '#bfa76a', fontWeight: 600 }}>{order.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Account;
