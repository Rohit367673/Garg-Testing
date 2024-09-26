import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import { AuthContext } from "./AuthContext";

function Account() {
  const { user } = useContext(AuthContext);
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);
  const location = useLocation();
  const userData = location.state; 
  
  const [formValues, setFormValues] = useState({
    Name: user?.Name || userData?.Name || "",
    Email: user?.Email || userData?.Email || "",
    birthday: "Birthday",
    phone: user?.Number || userData?.Number || "",
    password: user?.Pass || userData?.password || "",
    id: user?.id || userData?.id || ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    console.log(userData)
    if (userData) {
      setFormValues((prevValues) => ({
        ...prevValues,
        Name: userData.Name || prevValues.Name,
        Email: userData.Email || prevValues.Email,
        phone: userData.phone || prevValues.phone,
        id: userData.id || prevValues.id,
        photo: userData.ProfilePic || prevValues.ProfilePic
      }));
    }
  }, [userData]);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
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
      .post("http://localhost:3001/updateProfile", formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bodytag">
      <div className="profile-container">
        <div className="headertag">
          <Link to="/">
            <div className="back-button">&larr;</div>
          </Link>
          <h1>{formValues.Name}</h1>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={imageUploader}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "0.2px solid black",
                margin: "17px",
                marginTop: "2rem",
              }}
              onClick={() => imageUploader.current.click()}
            >
              <img
                ref={uploadedImage}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  margin: "0rem auto auto",
                }}
                alt="Profile"
                src={formValues.photo}
              />
            </div>
          </div>

          <div className="box1">
            <div className="field">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="Name"
                  value={formValues.Name}
                  onChange={handleChange}
                />
              ) : (
                <span>{formValues.Name}</span>
              )}
            </div>
            <div className="field">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="Email"
                  value={formValues.Email}
                  onChange={handleChange}
                />
              ) : (
                <span>{formValues.Email}</span>
              )}
            </div>
            <div className="field">
              <label>Birthday:</label>
              {isEditing ? (
                <input
                  type="month"
                  name="birthday"
                  value={formValues.birthday}
                  onChange={handleChange}
                />
              ) : (
                <span>{formValues.birthday}</span>
              )}
            </div>
            <div className="field">
              <label>Phone:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                />
              ) : (
                <span>{formValues.phone}</span>
              )}
            </div>
            <div className="field">
              <label>Password:</label>
              {isEditing ? (
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                  />
                  <button onClick={togglePasswordVisibility}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              ) : (
                <span>{"*".repeat(formValues.password.length)}</span>
              )}
            </div>
            {isEditing && (
              <button className="save-button" onClick={handleSaveClick}>
                Save
              </button>
            )}
          </div>

          {!isEditing && (
            <button className="edit-button" onClick={handleEditClick}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
