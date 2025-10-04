import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import StudentOrder from './pages/StudentOrder';
import StaffLogin from './pages/StaffLogin';
import StaffHome from './pages/StaffHome';
import StaffDashboard from './pages/StaffDashboard';
import StaffIncomingOrders from './pages/StaffIncomingOrders';
import StaffPastOrders from './pages/StaffPastOrders';
import StaffMenuManager from './pages/StaffMenuManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/student" element={<StudentOrder />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/home" element={<StaffHome />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/incoming" element={<StaffIncomingOrders />} />
        <Route path="/staff/past" element={<StaffPastOrders />} />
        <Route path="/staff/menu-manager" element={<StaffMenuManager />} />
      </Routes>
    </Router>
  );
}

export default App;
