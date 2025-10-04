import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './StaffMenuManager.module.css';

const socket = io('http://localhost:5000');

function StaffMenuManager() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu();

    socket.on('menuUpdated', (updatedMenu) => setMenu(updatedMenu));
    return () => socket.off('menuUpdated');
  }, []);

  const fetchMenu = () => {
    fetch('http://localhost:5000/menu')
      .then(res => res.json())
      .then(data => setMenu(data));
  };

  const markAsOver = (itemId) => {
    fetch(`http://localhost:5000/menu/${itemId}/over`, { method: 'PUT' })
      .catch(err => console.error(err));
  };

  const makeAvailable = (itemId) => {
    fetch(`http://localhost:5000/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: true })
    }).catch(err => console.error(err));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Menu Manager</h2>
      <ul className={styles.menuList}>
        {menu.map(item => (
          <li key={item.id} className={styles.menuItem}>
            <div>
              <span className={styles.itemName}>{item.name}</span> - 
              <span className={styles.itemPrice}>₹{item.price}</span>
            </div>
            <div>
              {item.available ? (
                <button className={styles.button} onClick={() => markAsOver(item.id)}>
                  Mark as Over
                </button>
              ) : (
                <>
                  <span className={styles.overLabel}>Over</span>
                  <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => makeAvailable(item.id)}>
                    Make Available
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StaffMenuManager;
