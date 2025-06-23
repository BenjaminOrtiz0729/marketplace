import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import { setLocalUser } from '../services/userService';
const md5 = require('md5');


export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    function isValidGmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return re.test(email);
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!isValidGmail(email)) {
        setError('Please enter a valid Gmail address.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post('http://racingcar-backend.onrender.com/api/user/login', {
          email: email,
          password : md5(password),
        });
        
        const user = response.data.user;
        if (response.status === 200) {
          onLogin(user);
          setLocalUser(user);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">Email (Gmail only)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className="login-input"
              disabled={loading}
            />
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="login-input"
              disabled={loading}
            />
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="login-footer-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="login-link-button"
              onClick={() => window.location.reload()} // or your callback to switch register/login
              disabled={loading}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    );
  }
