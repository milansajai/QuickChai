import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './StaffDashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const socket = io('http://localhost:5000');

function StaffDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    topItems: [],
    busiestHours: {}
  });

  const fetchStats = () => {
    fetch('http://localhost:5000/staff-stats')
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error('Failed to fetch stats:', err));
  };

  useEffect(() => {
    fetchStats();
    socket.on('ordersUpdated', fetchStats);
    return () => socket.off('ordersUpdated', fetchStats);
  }, []);

  const topItemsChart = {
    labels: stats.topItems.map(i => i[0]),
    datasets: [
      {
        label: 'Quantity Sold',
        data: stats.topItems.map(i => i[1]),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const busiestHoursChart = {
    labels: Array.from({ length: 24 }, (_, i) => i + ':00'),
    datasets: [
      {
        label: 'Orders',
        data: Array.from({ length: 24 }, (_, i) => stats.busiestHours[i] || 0),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)'
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Staff Dashboard</h2>

      <div className={styles.statsCard}>
        <div className={styles.statBadge}>
          <span>🛒</span>
          Total Orders
          <div>{stats.totalOrders}</div>
        </div>
        <div className={styles.statBadge}>
          <span>💰</span>
          Total Revenue
          <div>₹{stats.totalRevenue}</div>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Most Popular Items</h4>
          {stats.topItems.length === 0 ? <p>No data</p> : <Bar data={topItemsChart} />}
        </div>

        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Busiest Hours</h4>
          {Object.keys(stats.busiestHours).length === 0 ? <p>No data</p> : <Line data={busiestHoursChart} />}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
