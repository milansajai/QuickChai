const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

const MENU_FILE = './menu.json';
const ORDERS_FILE = './orders.json';

// Utility to read/write JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- Menu Endpoints ---
app.get('/menu', (req, res) => res.json(readJSON(MENU_FILE)));

app.put('/menu/:id', (req, res) => {
  const menu = readJSON(MENU_FILE);
  const item = menu.find(m => m.id === parseInt(req.params.id));
  if (item) {
    item.available = req.body.available;
    writeJSON(MENU_FILE, menu);
    io.emit('menuUpdated', menu);
    res.json(item);
  } else res.status(404).json({ message: 'Item not found' });
});

// Mark item as over
app.put('/menu/:id/over', (req, res) => {
  const menu = readJSON(MENU_FILE);
  const itemId = parseInt(req.params.id);
  const item = menu.find(m => m.id === itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.available = false;
  writeJSON(MENU_FILE, menu);
  io.emit('menuUpdated', menu);
  res.json({ message: 'Item marked as over', item });
});

// --- Orders Endpoints ---
app.post('/orders', (req, res) => {
  const { name, department, items, total } = req.body;
  const orders = readJSON(ORDERS_FILE);

  const token = orders.length > 0 ? Math.max(...orders.map(o => o.token || 0)) + 1 : 1;

  const newOrder = {
    token,
    name,
    department,
    items,
    total,
    verified: false,
    served: false,
    cancelled: false,
    time: Date.now()
  };

  orders.push(newOrder);
  writeJSON(ORDERS_FILE, orders);
  io.emit('ordersUpdated', orders);
  res.json(newOrder);
});

// Pending order (UPI flow)
app.post('/orders/pending', (req, res) => {
  const { name, department, items, total } = req.body;
  const orders = readJSON(ORDERS_FILE);

  const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.orderId || 0)) + 1 : 1;

  const newOrder = {
    orderId,
    items,
    total,
    name,
    department,
    verified: false,
    served: false,
    cancelled: false,
    time: Date.now()
  };

  orders.push(newOrder);
  writeJSON(ORDERS_FILE, orders);

  const upiLink = `upi://pay?pa=quickchai@upi&pn=QuickChai&am=${total}&cu=INR&tid=${orderId}`;
  io.emit('ordersUpdated', orders);
  res.json({ orderId, upiLink, total });
});

// Confirm payment
app.put('/orders/verify/:orderId', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find(o => o.orderId === parseInt(req.params.orderId));
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.verified = true;
  const existingTokens = orders.filter(o => o.token).map(o => o.token);
  const token = existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 1;
  order.token = token;

  writeJSON(ORDERS_FILE, orders);
  io.emit('ordersUpdated', orders);
  res.json(order);
});

// Get all orders
app.get('/orders', (req, res) => res.json(readJSON(ORDERS_FILE)));

// Serve order by token
app.put('/orders/:token/serve', (req, res) => {
  const orders = readJSON(ORDERS_FILE);
  const order = orders.find(o => o.token === parseInt(req.params.token));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (!order.verified) return res.status(400).json({ message: 'Not verified yet' });

  order.served = true;
  writeJSON(ORDERS_FILE, orders);
  io.emit('ordersUpdated', orders);
  res.json(order);
});

// Staff Stats
app.get('/staff-stats', (req, res) => {
  const orders = readJSON(ORDERS_FILE).filter(o => o.verified && !o.cancelled);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const today = new Date();
  const todayOrdersList = orders.filter(o => {
    const orderDate = new Date(o.time);
    return orderDate.getDate() === today.getDate() &&
           orderDate.getMonth() === today.getMonth() &&
           orderDate.getFullYear() === today.getFullYear();
  });
  const todayOrders = todayOrdersList.length;
  const todayRevenue = todayOrdersList.reduce((sum, o) => sum + (o.total || 0), 0);

  const itemCounts = {};
  orders.forEach(order => {
    (order.items || []).forEach(i => {
      if (!itemCounts[i.name]) itemCounts[i.name] = 0;
      itemCounts[i.name] += i.quantity;
    });
  });
  const topItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const busiestHours = {};
  orders.forEach(order => {
    const hour = new Date(order.time).getHours();
    if (!busiestHours[hour]) busiestHours[hour] = 0;
    busiestHours[hour] += 1;
  });

  res.json({ totalOrders, totalRevenue, todayOrders, todayRevenue, topItems, busiestHours });
});

// --- Socket.io ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
