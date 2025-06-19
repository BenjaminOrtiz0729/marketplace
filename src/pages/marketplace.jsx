import React, { useEffect, useState } from 'react';
import '../styles/Marketplace.css';
import { getUser, loginGuest, getBalance, setBalance } from '../services/userService';

export default function Marketplace() {
  const [user, setUser] = useState(null);
  const [raceCoinBalance, setRaceCoinBalance] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let currentUser = getUser();
    if (!currentUser) {
      currentUser = loginGuest();
    }
    setUser(currentUser);
    setRaceCoinBalance(getBalance(currentUser.username));
  }, []);

  const handleGetFreeCoin = () => {
    if (!user) return;
    if (raceCoinBalance > 0) {
      setMessage('You already have RaceCoins.');
    } else {
      setBalance(user.username, 100);
      setRaceCoinBalance(100);
      setMessage('You received 100 RaceCoins! Enjoy the race!');
    }
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>🏁 RaceCoin Marketplace</h1>
        <p>Welcome <strong>{user?.username}</strong>! RaceCoins are used to join races, upgrade your car, and place bets.</p>
      </header>

      <div className="racecoin-balance">
        <h2>Your Balance: {raceCoinBalance ?? 'Loading...'} RSC</h2>
      </div>

      {raceCoinBalance === 0 && (
        <div className="get-coin-section">
          <button className="get-coin-button" onClick={handleGetFreeCoin}>
            🎁 Get Free RaceCoins
          </button>
        </div>
      )}

      {message && <p className="message-box">{message}</p>}

      <footer className="marketplace-footer">
        <p>RaceCoin (RSC) is the official coin for all racing activity in our game.</p>
        <p>Earn more coins by racing and winning!</p>
      </footer>
    </div>
  );
}
