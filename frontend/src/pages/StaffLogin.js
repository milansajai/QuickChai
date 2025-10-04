import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StaffLogin.module.css';

function StaffLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'quickchai123') {
      navigate('/staff/home');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Staff Login</h2>
      <div className={styles.form}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>Login</button>
      </div>
    </div>
  );
}

export default StaffLogin;
