import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = ({ onLogout }) => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/coupons', {
          // Asegúrate de incluir credenciales si es necesario, como un token de autenticación
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ejemplo de cómo enviar un token
          },
        });
        setCoupons(response.data);
      } catch (error) {
        setError('Failed to load coupons');
        console.error(error.response ? error.response.data : error.message);
      }
    };

    fetchCoupons();
  }, []);

  // Function to handle coupon redemption...
  const handleRedeem = async (couponId) => {
    try {
      // Redeem logic here...
      const response = await axios.post(`http://localhost:3000/coupons/${couponId}/redeem`);
      // Handle successful redemption...
    } catch (error) {
      // Handle errors...
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      {coupons.length ? (
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon.id}>
              {coupon.code} - {coupon.isActive ? 'Active' : 'Inactive'}
              <button onClick={() => handleRedeem(coupon.id)}>Redeem</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No coupons available.</div>
      )}
    </div>
  );
};

export default CustomerDashboard;
