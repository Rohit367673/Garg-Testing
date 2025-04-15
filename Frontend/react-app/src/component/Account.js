import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import Footer from "./Footer";

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
    Number: user?.Number || userData?.Number || "",
    id: user?.id || userData?.id || "",
    photo: user?.photo || userData?.photo || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormValues((prevValues) => ({
        ...prevValues,
        Name: userData.Name || prevValues.Name,
        Email: userData.Email || prevValues.Email,
        Number: userData.Number || prevValues.Number,
        id: userData.id || prevValues.id,
        photo: userData.ProfilePic || prevValues.ProfilePic,
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
      .post(`${process.env.REACT_APP_BACKEND_URL}/updateProfile`, formValues, {
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

  return (
    <>
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
                  src={formValues.photo || "default-image-url"}
                />
              </div>
            </div>

            <div className="box1">
              <div className="field">
                <label>Name:</label>
                {isEditing ? (
                  <input
                    placeholder="Enter Name"
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
                    placeholder="Enter Email"
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
                    placeholder="Enter Birthday"
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
                    placeholder="Enter Phone"
                    type="text"
                    name="phone"
                    value={formValues.Number}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formValues.Number}</span>
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
      <Footer />
    </>
  );
}

export default Account;
