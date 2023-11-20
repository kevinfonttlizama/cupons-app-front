import React from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const CouponsTable = ({ coupons, refreshCoupons, onEditCoupon, setShowModal, setEditingCoupon }) => {
  const handleEditCoupon = (coupon) => {
    const authToken = localStorage.getItem('authToken');
    axios.get(`http://localhost:3000/api/coupons/${coupon.id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      setEditingCoupon(response.data);
      setShowModal(true);
    })
    .catch(error => console.error('Error fetching coupon details: ', error));
  };

  const handleToggleActivation = (coupon) => {
    const authToken = localStorage.getItem('authToken');
    axios.put(`http://localhost:3000/api/coupons/${coupon.id}`, { active: !coupon.active }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(() => {
      refreshCoupons();
    })
    .catch(error => console.error('Error updating coupon: ', error));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Code</th>
          <th>Discount Type</th>
          <th>Value</th>
          <th>Max Amount</th>
          <th>Min Purchase Value</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((coupon) => (
          <tr key={coupon.id}>
            <td>{coupon.code}</td>
            <td>{coupon.discount_type}</td>
            <td>{coupon.discount_value}</td>
            <td>{coupon.max_amount}</td>
            <td>{coupon.min_purchase_value}</td>
            <td>{coupon.active ? 'Sí' : 'No'}</td>
            <td>
              <Button variant={coupon.active ? "warning" : "success"} onClick={() => handleToggleActivation(coupon)}>
                {coupon.active ? 'Desactivar' : 'Activar'}
              </Button>
              {' '}
              <Button variant="secondary" onClick={() => handleEditCoupon(coupon)} disabled={!coupon.active}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CouponsTable;
