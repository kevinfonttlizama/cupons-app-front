import React, { useState } from 'react';
import axios from 'axios';

const PurchaseComponent = () => {
  const [items, setItems] = useState([]); 
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [total, setTotal] = useState(0);
  const authToken = localStorage.getItem('authToken');

  const handlePurchase = () => {
    axios.post('http://localhost:3000/purchases', 
      { 
        items, 
        coupon_code: couponCode 
      },
      { headers: { 'Authorization': `Bearer ${authToken}` } }
    )
    .then(response => {
      setMessage("Purchase created successfully.");

      setCouponCode('');
      setCouponDetails(null);
      setItems([]);
      setTotal(0);
    })
    .catch(error => {
      setMessage(error.response?.data?.error || 'Error in creating purchase.');
    });
  };
  
  const applyCoupon = () => {
    axios.post(`http://localhost:3000/api/customer/coupons/verify`, 
      { code: couponCode, purchase_total: total },
      { headers: { 'Authorization': `Bearer ${authToken}` } }
    )
    .then(response => {
      const coupon = response.data;
      let discountValue = 0;
  
      if (coupon.discount_type === 'flat') {
        discountValue = Math.min(coupon.discount_value, coupon.max_amount);
      } else if (coupon.discount_type === 'percentage') {
   
        const percentageDiscount = total * (coupon.discount_value / 100);
   
        discountValue = Math.min(percentageDiscount, coupon.max_amount);
      }
  
      const newTotal = total - discountValue;
      setTotal(newTotal > 0 ? newTotal : 0); 
  
      setMessage(`Discount applied successfully. New total: ${newTotal}`);
    })
    .catch(error => {
      setMessage(error.response?.data?.error || 'Error applying coupon.');
    });
  };
  
  
  
  return (
    <div>
      {}
      {}
      <button onClick={handlePurchase}>Purchase</button>

      {}
      <input 
        type="text" 
        value={couponCode} 
        onChange={(e) => setCouponCode(e.target.value)} 
        placeholder="Enter Coupon Code"
      />
      <button onClick={applyCoupon}>Apply Coupon</button>

      {}
      {message && <p>{message}</p>}
      <p>Total Amount: {total}</p>
    </div>
  );
};

export default PurchaseComponent;
