import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css';

function Homepage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [highlights, setHighlights] = useState({
    frequentFoody: null,
    hungriestDept: null,
    topItem: null,
    topOrder: null
  });

  useEffect(() => {
    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => calculateHighlights(data));
  }, []);

  const calculateHighlights = (orders) => {
    if (!orders || orders.length === 0) return;

    const userStats = {};
    const deptStats = {};
    const itemStats = {};
    let maxOrder = { total: 0 };

    orders.forEach(order => {
      if (!order.name || !order.department) return;

      if (!userStats[order.name]) userStats[order.name] = 0;
      userStats[order.name] += 1;

      if (!deptStats[order.department]) deptStats[order.department] = 0;
      deptStats[order.department] += 1;

      order.items.forEach(i => {
        if (!itemStats[i.name]) itemStats[i.name] = 0;
        itemStats[i.name] += i.quantity;
      });

      if (order.total > maxOrder.total) maxOrder = order;
    });

    const frequentFoody = Object.entries(userStats).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A';
    const hungriestDept = Object.entries(deptStats).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A';
    const topItem = Object.entries(itemStats).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A';

    setHighlights({
      frequentFoody,
      hungriestDept,
      topItem,
      topOrder: maxOrder.total || 0
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>QUICKCHAI ☕︎</h1>

      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={()=>navigate('/student')}>Student</button>
        <button className={styles.button} onClick={()=>navigate('/staff/login')}>Staff</button>
      </div>

      <div className={styles.highlights}>
        <h2>ALL TIME HIGHLIGHTS</h2>
        <p className={styles.highlightItem}>Frequent Foody 🍽️<span>{highlights.frequentFoody}</span></p>
        <p className={styles.highlightItem}>Hungriest Department 🏫<span>{highlights.hungriestDept}</span></p>
        <p className={styles.highlightItem}>Top Item 🥇<span>{highlights.topItem}</span></p>
        <p className={styles.highlightItem}>Top Order Amount 💰<span>₹{highlights.topOrder}</span></p>
      </div>
    </div>
  );
}

export default Homepage;
