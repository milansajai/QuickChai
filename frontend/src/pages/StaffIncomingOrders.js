import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './StaffIncomingOrders.module.css';

const socket = io('http://localhost:5000');

function StaffIncomingOrders() {
  const [orders, setOrders] = useState([]);
  const prevOrders = useRef([]);

  useEffect(() => {
    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        prevOrders.current = data;
      });

    socket.on('ordersUpdated', data => {
      setOrders(data);

      const newOrders = data.filter(
        o => !prevOrders.current.some(po => po.token === o.token)
      );
      if (newOrders.length > 0) {
        alert(`New order received! Token: ${newOrders[0].token}`);
      }

      prevOrders.current = data;
    });

    return () => socket.off('ordersUpdated');
  }, []);

  const verifyOrder = token => {
    fetch(`http://localhost:5000/orders/${token}/verify`, { method: 'PUT' })
      .then(res => res.json())
      .then(updatedOrder => {
        if (updatedOrder && updatedOrder.verified !== undefined) {
          setOrders(prev =>
            prev.map(o =>
              o.token === token ? { ...o, verified: updatedOrder.verified } : o
            )
          );
        }
      });
  };

  const markServed = token => {
    fetch(`http://localhost:5000/orders/${token}/serve`, { method: 'PUT' })
      .then(res => res.json())
      .then(updatedOrder => {
        if (updatedOrder && updatedOrder.served !== undefined) {
          setOrders(prev =>
            prev.map(o =>
              o.token === token ? { ...o, served: updatedOrder.served } : o
            )
          );
        }
      });
  };

  const incomingOrders = orders.filter(o => !o.served);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Incoming Orders</h2>
      {incomingOrders.length === 0 ? (
        <p>No incoming orders</p>
      ) : (
        <ul className={styles.orderList}>
          {incomingOrders.map(order => (
            <li key={order.token} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                Token: {order.token} - {order.name} ({order.department}) - Total: ₹{order.total}
              </div>

              {!order.verified ? (
                <button
                  className={`${styles.statusButton} ${styles.verify}`}
                  onClick={() => verifyOrder(order.token)}
                >
                  Verify Payment
                </button>
              ) : (
                <span style={{ color: 'green', marginLeft: '5px', fontWeight: 'bold' }}>
                  Verified
                </span>
              )}

              {order.verified && !order.served && (
                <button
                  className={`${styles.statusButton} ${styles.markServed}`}
                  onClick={() => markServed(order.token)}
                >
                  Mark Served
                </button>
              )}

              <ul className={styles.itemList}>
                {order.items.map(i => (
                  <li key={i.id}>
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

export default StaffIncomingOrders;
