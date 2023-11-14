import React, { useState } from 'react';
import { Container, Navbar, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const CustomerDashboard = ({ onLogout, authToken }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${authToken}` // Asegúrate de que authToken contenga el token correcto
    }
  };


  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
    setCouponDetails(null);
    setErrorMessage('');
  };

  const handleVerifyCoupon = () => {
    axios.post(`http://localhost:3000/api/customer/coupons/verify`, { code: couponCode })
      .then(response => {
        console.log(response.data); // Agregar esto para depurar la respuesta
        setCouponDetails(response.data);
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Error verifying coupon.');
        setCouponDetails(null);
      });
  };
  
  
  const handleRedeemCoupon = () => {
    axios.post(`http://localhost:3000/api/customer/coupons/${couponDetails.id}/redeem`)
      .then(response => {
        alert(response.data.message || 'Coupon redeemed successfully.');
        setCouponCode('');
        setCouponDetails(null);
      })
      .catch(error => {
        alert(error.response?.data?.error || 'Error redeeming coupon.');
      });
  };
  

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Customer Dashboard</Navbar.Brand>
        <Button onClick={onLogout}>Logout</Button>
      </Navbar>
      <Container>
        <h1>Welcome, Customer!</h1>
        <div>
          <input type="text" value={couponCode} onChange={handleCouponCodeChange} placeholder="Enter Coupon Code" />
          <Button onClick={handleVerifyCoupon}>Verify</Button>
        </div>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {couponDetails && (
         <Card>
         <Card.Body>
           <Card.Title>Coupon Details</Card.Title>
           <Card.Text>{couponDetails.description}</Card.Text>
           <Card.Text>
             Discount Type: {couponDetails.discount_type || 'N/A'}
           </Card.Text>
           <Card.Text>
             Discount Value: {typeof couponDetails.discount_value !== 'undefined' ? 
               (couponDetails.discount_type === 'percentage' ? 
                 `${couponDetails.discount_value}%` : 
                 `$${couponDetails.discount_value}`
               ) : 
               'N/A'}
           </Card.Text>
           <Button onClick={handleRedeemCoupon}>Redeem Coupon</Button>
         </Card.Body>
       </Card>
        )}
      </Container>
    </Container>
  );
};

export default CustomerDashboard;
