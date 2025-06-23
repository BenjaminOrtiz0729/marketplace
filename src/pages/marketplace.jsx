import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getLocalUser, setLocalUser } from '../services/userService';

export default function Marketplace({ onLogout }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [rewarded, setReward] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currUser = getLocalUser();
    setUser(currUser);
    setReward(currUser.is_reward);
    setBalance(currUser.balance);
  }, []);

  useEffect(() => {    
    const currentUser = getLocalUser();
    currentUser.balance = balance;
    currentUser.is_reward = rewarded;
    setLocalUser(currentUser);
    setUser(currentUser);
  }, [balance, rewarded]);

  const handleGetFreeCoin = async () => {
    if (!user) return;
    
    let ret = await axios.post(`http://racingcar-backend.onrender.com/api/user/getReward/${user.username}`);
    
    if(ret.status == 200){
      if (ret.data.is_reward == true) {
        setMessage('You already have RaceCoins.');
      } else {
        
        const response = await axios.post(`http://racingcar-backend.onrender.com/api/user/getBalance/${user.username}`);
        if(response.status == 200){
          
          const bal = response.data.balance + 100;             
          setBalance(bal);
          
          ret = await axios.post('http://racingcar-backend.onrender.com/api/user/setBalance', {
            username : user.username,
            balance : bal
          });

          if(ret.status == 200)
            setReward(true);

          setMessage('You received 100 RaceCoins! Enjoy the race!');
        }          
      }
    }else{
      setMessage('Sorry Please try again later');
    }  
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <h1>🏁 RaceCoin Marketplace</h1>
        <p>Welcome <strong>{user?.username}</strong>! RaceCoins are used to join races, upgrade your car, and place bets.</p>
        {/* 🔒 Logout Button */}
        <button className="logout-button" onClick={onLogout}>
          🔒 Logout
        </button>
      </header>

      <div className="racecoin-balance">
        <h2>Your Balance: {user?.balance} RSC</h2>
      </div>

      {balance === 0 && (
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
