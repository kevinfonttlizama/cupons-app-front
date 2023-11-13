import React from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

const CouponsTable = ({ coupons, refreshCoupons, onEditCoupon, setShowModal, setEditingCoupon }) => {
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleToggleActivation = (coupon) => {
    axios.put(`http://localhost:3000/api/coupons/${coupon.id}`, { active: !coupon.active })
      .then(() => {
        refreshCoupons(); 
      })
      .catch(error => console.error('Error updating coupon: ', error));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Código</th>
          <th>Tipo de Descuento</th>
          <th>Valor</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((coupon) => (
          <tr key={coupon.id}>
            <td>{coupon.code}</td>
            <td>{coupon.discount_type}</td>
            <td>{coupon.discount_value}</td>
            <td>{coupon.active ? 'Sí' : 'No'}</td>
            <td>
              <Button variant={coupon.active ? "warning" : "success"} onClick={() => handleToggleActivation(coupon)}>
                {coupon.active ? 'Desactivar' : 'Activar'}
              </Button>
              {' '}
              <Button variant="secondary" onClick={() => handleEditCoupon(coupon)} disabled={coupon.active}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CouponsTable;
