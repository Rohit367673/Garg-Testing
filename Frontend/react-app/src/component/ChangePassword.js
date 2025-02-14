import { useState } from "react";
import axios from "axios";


function ChangePassword() {
  const [Email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  

  const handlePasswordChange =(e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Entered Passwords do not match");
      return;
    }
    axios.post("http://localhost:3001/change-password", {
        Email,
        currentPassword,
        newPassword
      })
    .then((response) => {
      if (response.data.message === "Password updated successfully") {
        setSuccess("Password updated successfully");
        setError("");
      } else {
        setError(response.data.message);
        setSuccess("");
      }})
      .catch((err) => {
        setError("Something went wrong. Please try again.");
        console.error(err);
      });
  }
  return (
    <>

    <form className="change-password-form" onSubmit={handlePasswordChange}>
      <h1>Change Password</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password:</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="change-password-btn mb-4">Change Password</button>

     

    </form>
    </>
  );
}


export default ChangePassword;
