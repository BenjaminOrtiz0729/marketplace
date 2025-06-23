import React, { useState, useEffect } from 'react';
import Marketplace from '../src/pages/Marketplace';
import RegisterPage from '../src/pages/RegisterPage';
import LoginPage from '../src/pages/LoginPage';
import { getLocalUser } from './services/userService';
import { auth } from './firebase';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // false = show register, true = show login

  useEffect(() => {
    const storedUser = getLocalUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.clear();
      setUser(null);
      setShowLogin(true); // back to register after logout
    });
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <Router>
      <div className="App">
        {user ? (
          <Marketplace onLogout={handleLogout} />
        ) : showLogin ? (
          <>
            <LoginPage onLogin={handleLoginSuccess} onSwitchToRegister={() => setShowLogin(false)} />
          </>
        ) : (
          <>
            <RegisterPage onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setShowLogin(true)} />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
