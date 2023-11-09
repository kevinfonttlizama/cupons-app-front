import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Supongamos que guardas el rol del usuario en localStorage o en alguna otra parte
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUserRole(userData.role);
    localStorage.setItem('token', userData.token); // Asegúrate de que tu API envíe el token
    localStorage.setItem('userRole', userData.role); // Guarda el rol del usuario
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={`/${userRole}`} replace />} />
        <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} />
        <Route path="/customer" element={isAuthenticated && userRole === 'customer' ? <CustomerDashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? `/${userRole}` : '/'} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
