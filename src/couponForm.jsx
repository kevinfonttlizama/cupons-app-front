import React, { useState } from 'react';
import axios from 'axios';

const CouponForm = ({ token, onCouponCreated }) => {
  const [couponData, setCouponData] = useState({
    code: '',
    discountType: ['flat','percentage'],
    discountValue: 0,
    maxCount: 0,
    maxAmount: 0,
    minPurchaseValue: 0,
  });

  const handleChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/coupons', couponData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onCouponCreated(response.data);
  
    } catch (error) {
      console.error('Error creating coupon', error);

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* input fields for code, discountType, etc. */}
      <input
        name="code"
        value={couponData.code}
        onChange={handleChange}
        placeholder="Coupon Code"
      />
      {/* ...other fields... */}
      <button type="submit">Create Coupon</button>
    </form>
  );
};

export default CouponForm;
