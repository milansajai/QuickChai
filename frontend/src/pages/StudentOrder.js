import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { io } from 'socket.io-client';
import styles from './StudentOrder.module.css';

const socket = io('http://localhost:5000');

function StudentOrder() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [departments] = useState([
    "Civil Engineering", "Mechanical Engineering", "Electrical and Electronics Engineering",
    "Electronics and Communication Engineering", "Computer Science and Engineering",
    "Architecture and Planning", "Industrial Engineering",
    "Applied Electronics & Instrumentation", "Electrical and Computer Engineering", "Others"
  ]);
  const [lastOrders, setLastOrders] = useState([]);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paidOrder, setPaidOrder] = useState(null);
  const [popupOrder, setPopupOrder] = useState(null);

  useEffect(() => {
    fetchMenu();
    socket.on('menuUpdated', updatedMenu => setMenu(updatedMenu));
    return () => socket.off('menuUpdated');
  }, []);

  const fetchMenu = () => {
    fetch('http://localhost:5000/menu')
      .then(res => res.json())
      .then(data => setMenu(data));
  };

  const addToCart = item => {
    if (!item.available) return;
    const existing = cart.find(i => i.id === item.id);
    if (existing) setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    else setCart([...cart, { ...item, quantity: 1 }]);
  };

  const removeFromCart = item => {
    const existing = cart.find(i => i.id === item.id);
    if (!existing) return;
    if (existing.quantity === 1) setCart(cart.filter(i => i.id !== item.id));
    else setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
  };

  const placeOrder = () => {
    if (!name || !department) { alert("Please enter name and select department"); return; }
    if (cart.length === 0) { alert("Cart is empty"); return; }

    const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    fetch('http://localhost:5000/orders/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, department, items: cart, total })
    })
      .then(res => res.json())
      .then(data => { setCurrentPayment(data); setCart([]); });
  };

  const confirmPayment = () => {
    if (!currentPayment) return;
    fetch(`http://localhost:5000/orders/verify/${currentPayment.orderId}`, { method: 'PUT' })
      .then(res => res.json())
      .then(order => { setPaidOrder(order); setLastOrders(prev => [order, ...prev].slice(0, 3)); setCurrentPayment(null); });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Place Your Order</h2>
      <input className={styles.inputField} placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
      <select className={styles.selectField} value={department} onChange={e => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        {departments.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <h3 className={styles.sectionHeading}>Menu</h3>
      <ul className={styles.menuList}>
        {menu.map(item => (
          <li key={item.id}>
            {item.name} - ₹{item.price} {item.available ? '' : '(Out of stock)'}
            {item.available && <button className={styles.cartButton} onClick={() => addToCart(item)}>Add</button>}
          </li>
        ))}
      </ul>

      <h3 className={styles.sectionHeading}>Cart</h3>
      {cart.length === 0 ? <p>No items in cart</p> :
        <ul className={styles.cartList}>
          {cart.map(i => (
            <li key={i.id}>
              {i.name} x{i.quantity} - ₹{i.price * i.quantity}
              <button className={styles.cartButton} onClick={() => addToCart(i)}>+</button>
              <button className={styles.cartButton} onClick={() => removeFromCart(i)}>-</button>
            </li>
          ))}
        </ul>
      }
      <button className={styles.button} onClick={placeOrder}>Place Order</button>

      {currentPayment && (
        <div className={styles.paymentCard}>
          <h3>Scan to Pay</h3>
          <QRCodeCanvas value={currentPayment.upiLink} size={180} />
          <p>Amount: ₹{currentPayment.total}</p>
          <button className={styles.paymentButton} onClick={confirmPayment}>I Paid</button>
        </div>
      )}

      {paidOrder && (
        <div className={styles.paidOrderCard}>
          <h2>Show this token to staff</h2>
          <h1>{paidOrder.token}</h1>
          <p>Enjoy your food!</p>
        </div>
      )}

      {lastOrders.length > 0 && (
        <div>
          <h3 className={styles.sectionHeading}>Last Orders</h3>
          <ul className={styles.lastOrdersList}>
            {lastOrders.map(o => (
              <li key={o.orderId}>
                Token: {o.token} - ₹{o.total} ({o.items.map(i => `${i.name} x${i.quantity}`).join(', ')})
                <button className={styles.modalButton} onClick={() => setPopupOrder(o)}>View Token</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {popupOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Show this token to staff</h2>
            <h1>{popupOrder.token}</h1>
            <p><strong>Name:</strong> {popupOrder.name}</p>
            <p><strong>Department:</strong> {popupOrder.department}</p>
            <p><strong>Total:</strong> ₹{popupOrder.total}</p>
            <p><strong>Items:</strong> {popupOrder.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
            <p style={{ fontStyle: 'italic' }}>Enjoy your food!</p>
            <button className={styles.modalButton} onClick={() => setPopupOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentOrder;
