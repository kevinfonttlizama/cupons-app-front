import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CouponForm from './couponForm';
import CouponsTable from './CouponsTable';
import axios from 'axios';

const AdminDashboard = ({onLogout}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // deletes authtoken
    onLogout()
    navigate('/login'); // Rediricts to login
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null); // Resetart edit coupon
  };

  const refreshCoupons = () => {
    axios.get('http://localhost:3000/api/coupons')
      .then(response => {
        setCoupons(response.data);
      })
      .catch(error => {
        console.error('Error fetching coupons:', error);
      });
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  useEffect(() => {
    refreshCoupons();
  }, []);

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
        <Button onClick={handleLogout}>Logout</Button>
      </Navbar>

      <Container>
        <h1>Welcome, Admin!</h1>
        <Button variant="primary" onClick={handleOpenModal}>Crear Nuevo Cupón</Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCoupon ? 'Editar Cupón' : 'Crear Cupón'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CouponForm coupon={editingCoupon} refreshCoupons={refreshCoupons} />
          </Modal.Body>
        </Modal>

        <CouponsTable
          coupons={coupons}
          onEditCoupon={handleEditCoupon}
          refreshCoupons={refreshCoupons}
          setShowModal={setShowModal}
          setEditingCoupon={setEditingCoupon}
        />
      </Container>
    </Container>
  );
};

export default AdminDashboard;
