import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StaffHome.module.css';

function StaffHome() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome Staff</h2>
      <div className={styles.buttonCard}>
        <button className={styles.button} onClick={() => navigate('/staff/dashboard')}>
          Staff Dashboard
        </button>
        <button className={styles.button} onClick={() => navigate('/staff/incoming')}>
          View Incoming Orders
        </button>
        <button className={styles.button} onClick={() => navigate('/staff/past')}>
          View Past Orders
        </button>
        <button className={styles.button} onClick={() => navigate('/staff/menu-manager')}>
          Menu Manager
        </button>
      </div>
    </div>
  );
}

export default StaffHome;
