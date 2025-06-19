export function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  export function loginGuest() {
    const guest = { username: 'guest_' + Date.now(), id: Date.now() };
    localStorage.setItem('user', JSON.stringify(guest));
    return guest;
  }
  
  export function getBalance(username) {
    const balance = localStorage.getItem(`balance_${username}`);
    return balance ? parseInt(balance) : 0;
  }
  
  export function setBalance(username, amount) {
    localStorage.setItem(`balance_${username}`, amount);
  }
  