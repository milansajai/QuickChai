import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './StaffPastOrders.module.css';

const socket = io('http://localhost:5000');

function StaffPastOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Initial fetch of all orders
    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      });

    // Listen for real-time updates
    socket.on('ordersUpdated', data => setOrders(data));

    return () => socket.off('ordersUpdated');
  }, []);

  // Filter only served or cancelled orders
  const pastOrders = orders.filter(o => o.served || o.cancelled);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Past Orders</h2>
      {pastOrders.length === 0 ? (
        <p className={styles.noOrders}>No past orders</p>
      ) : (
        <ul className={styles.orderList}>
          {pastOrders.map(order => (
            <li
              key={order.token || order.orderId}
              className={`${styles.orderItem} ${order.cancelled ? styles.cancelled : ''}`}
            >
              <div className={styles.orderHeader}>
                <strong>Token: {order.token || '—'}</strong>
                {order.served && !order.cancelled && <span className={styles.served}>Served</span>}
                {order.cancelled && <span className={styles.cancelledLabel}>Cancelled</span>}
              </div>
              <p className={styles.customer}>
                {order.name} ({order.department}) - Total: ₹{order.total}
              </p>
              <ul className={styles.items}>
                {(order.items || []).map(i => (
                  <li key={i.id} className={styles.item}>
                    {i.name} x{i.quantity} - ₹{i.price * i.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StaffPastOrders;
