import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterPage.css';
//import { setUser } from '../services/userService';
const md5 = require('md5');

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState('');

  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const sendVerificationCode = async () => {
    if (!email || !isValidGmail(email)) {
      setMessage('Please enter a valid Gmail before sending code.');
      return;
    }
    try {
      await axios.post('https://racingcar-backend.onrender.com/api/user/send-code', { email });
      setMessage('Verification code sent! Check your Gmail.');
      setCodeSent(true);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.error || 'Failed to send verification code');
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setMessage('Please enter the verification code.');
      return;
    }
    try {
      await axios.post('https://racingcar-backend.onrender.com/api/user/verify-code', { email, code: verificationCode });
      setMessage('Code verified! You can now register.');
      setCodeVerified(true);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Verification failed');
      setCodeVerified(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !retypePassword) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (!isValidGmail(email)) {
      setMessage('Only valid Gmail addresses allowed.');
      return;
    }
    if (password !== retypePassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post('https://racingcar-backend.onrender.com/api/user/register', {
        username: firstName + lastName,
        password: md5(password),
        email: email,
      });

      // const user = res.data;
      // setUser(user);

    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.error || 'Registration failed');
    }

    onRegisterSuccess();
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">📝 Register for RaceCoin Marketplace</h2>

        <div className="name-inputs">
          <input
            className="register-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="register-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <label className="register-label">Email (Gmail only)</label>
        <input
          className="register-input"
          type="email"
          placeholder="Enter your Gmail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setCodeSent(false);
            setCodeVerified(false);
            setMessage('');
            setVerificationCode('');
          }}
        />

        <button
          className="register-button"
          onClick={sendVerificationCode}
          disabled={codeSent}
        >
          {codeSent ? 'Code Sent' : 'Send Verification Code'}
        </button>

        {codeSent && (
          <>
            <input
              className="register-input"
              type="text"
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ marginTop: '15px' }}
            />
            <button
              className="register-button"
              onClick={verifyCode}
              style={{ marginTop: '10px' }}
            >
              Verify Code
            </button>
          </>
        )}

        <label className="register-label" style={{ marginTop: '15px' }}>Password</label>
        <input
          className="register-input"
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!codeVerified}
        />

        <label className="register-label">Retype Password</label>
        <input
          className="register-input"
          type="password"
          placeholder="Retype Password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          disabled={!codeVerified}
        />

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={!codeVerified}
          style={{ marginTop: '20px' }}
        >
          Register
        </button>

        {message && <p className="register-message">{message}</p>}

        <p className="footer-text" style={{ marginTop: '15px' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="switch-button"
            style={{
              border: 'none',
              background: 'none',
              color: '#5a54b1',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
  
}
