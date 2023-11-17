import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');


  

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (token, role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
  };
  

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <CustomerDashboard onLogout={handleLogout} />} />
        <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} />
        <Route path="/customer" element={isAuthenticated && userRole === 'customer' ? <CustomerDashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? `/${userRole}` : '/'} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
