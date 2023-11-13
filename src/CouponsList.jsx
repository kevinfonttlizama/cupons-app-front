import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axios.get('/api/coupons')
      .then(response => {
        setCoupons(response.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div>
      <h2>List of Coupons</h2>
      {coupons.map(coupon => (
        <div key={coupon.id}>
          <p>{coupon.code} - {coupon.discount_type} - {coupon.discount_value}</p>
          {/* Más detalles del cupón aquí */}
        </div>
      ))}
    </div>
  );
};

export default CouponsList;
