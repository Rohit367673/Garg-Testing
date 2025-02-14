// AdminLogin.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../component/AuthContext';
import toast from 'react-hot-toast';

function AdminLogin() {
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/admin/login', { Email, Pass });
      if (res.data.message === "Admin login successful") {
        // Update the auth context with the token and mark the user as admin.
        login(res.data.token, { ...res.data.user, isAdmin: true });
        console.log("Admin")
        navigate('/Admin/Product'); // Redirect to the default admin page
      }
    } catch (err) {
      setError('Admin login failed. Please check your credentials.');
      toast.error('Admin login failed');
      console.error(err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={Email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter admin email" 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={Pass} 
            onChange={(e) => setPass(e.target.value)} 
            placeholder="Enter password" 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3f51b5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
