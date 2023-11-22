import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Alert, Card, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

const CustomerDashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const authToken = localStorage.getItem('authToken');
  const axiosConfig = { headers: { 'Authorization': `Bearer ${authToken}` } };

  useEffect(() => {
    axios.get('http://localhost:3000/api/items', axiosConfig)
      .then(response => {
        console.log("Products loaded", response.data);
        setProducts(response.data);
      })
      .catch(error => console.error('Error loading products:', error));
  }, []);
  

  useEffect(() => {
    const total = selectedProducts.reduce((sum, productId) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price : 0);
    }, 0);
    setOriginalTotal(total);
    if (isCouponApplied && couponDetails) {
      applyDiscount(couponDetails);
    } else {
      setPurchaseTotal(total); 
    }
  }, [selectedProducts, products, isCouponApplied, couponDetails]);

  

  const handleAddProduct = (productId) => {
    setSelectedProducts(currentSelectedProducts => [...currentSelectedProducts, productId]);
  };

  const handleVerifyCoupon = () => {
    setPurchaseTotal(originalTotal);
    axios.post('http://localhost:3000/api/customer/coupons/verify', { code: couponCode, purchase_total: purchaseTotal}, axiosConfig)
      .then(response => {
        const coupon = response.data;
        setCouponDetails({...coupon, id: coupon.id});
        setIsCouponApplied(true);
        setErrorMessage('');
  
        if (coupon.count_used >= (coupon.max_count || Number.MAX_VALUE)) {
          setErrorMessage('This coupon has reached its maximum use limit.');
          setPurchaseTotal(originalTotal);
          setDiscountAmount(0); 
          return;
        }
  
        if (purchaseTotal >= (coupon.min_purchase_value || 0)) {
          applyDiscount(coupon);
        } else {
          setErrorMessage('The purchase value does not meet the minimum required for the coupon.');
          setDiscountAmount(0); 
        }
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Error verifying coupon.');
        setCouponDetails(null);
        setDiscountAmount(0);
      });
  };
  
  
  
  const isValidCoupon = (coupon) => {

    if (coupon.count_used >= (coupon.max_count || Number.MAX_VALUE)) {
      alert('This coupon has reached its maximum use limit.');
      return false;
    }
  
    if (purchaseTotal < (coupon.min_purchase_value || 0)) {
      alert('The purchase value does not meet the minimum required for the coupon.');
      return false;
    }
  
    return true;
  };
  
  
  const applyDiscount = (coupon) => {
    let discountValue = 0;
  
    if (coupon.discount_type === 'flat') {
      discountValue = Math.min(coupon.discount_value, coupon.max_amount || coupon.discount_value);
    } else if (coupon.discount_type === 'percentage') {
      const percentageDiscount = purchaseTotal * (coupon.discount_value / 100);
      discountValue = originalTotal * (coupon.discount_value / 100);
    }
  
    discountValue = Math.min(discountValue, coupon.max_amount);
    setDiscountAmount(discountValue);
    setPurchaseTotal(originalTotal - discountValue);
  

  };
  
  
  
  
  const handlePurchase = () => {
    const purchaseData = {
      purchase: {
        items: selectedProducts.map(product => product.id),
        coupon_code: couponDetails ? couponCode : undefined,
        coupon_id: couponDetails ? couponDetails.id : undefined
      }
    };
    console.log("Sending purchase data:", purchaseData);
    axios.post('http://localhost:3000/api/purchases', purchaseData, axiosConfig)
      .then(response => {
        alert('Purchase Succesful');

        setSelectedProducts([]);
        setCouponCode('');
        setCouponDetails(null);
        setPurchaseTotal(0);
        setDiscountAmount(0);
      })
      .catch(error => {
        console.error('Error when making purchase:', error);
        alert('Error when making the purchase. Please try again.');
      });
  };


  return (
    <Container fluid>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Customer Dashboard</Navbar.Brand>
        <Button onClick={onLogout}>Logout</Button>
      </Navbar>

      <Row>
        {products.map(product => (
          <Col key={product.id} md={4}>
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>price: ${product.price}</Card.Text>
                <Button onClick={() => handleAddProduct(product.id)}>Add</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div>
        <h3>Resume</h3>
        <p>Total: ${purchaseTotal}</p>
        <p>Discount: ${discountAmount}</p>
        <Button onClick={handlePurchase}>Buy</Button>
      </div>

      <Form>
        <Form.Group>
          <Form.Label>Coupon Code : </Form.Label>
          <Form.Control 
            type="text" 
            value={couponCode} 
            onChange={e => setCouponCode(e.target.value)} 
          />
        </Form.Group>
        <Button onClick={handleVerifyCoupon}>Verify</Button>
      </Form>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {couponDetails && (
  <Alert variant="success">
    <p>Discount type: {couponDetails.discount_type}</p>
    <p>Discount Value: {couponDetails.discount_value}</p>
    <p>Max Amount: {couponDetails.max_amount || 'No especificado'}</p>
    <p>Min purchase Value: {couponDetails.min_purchase_value || 'No especificado'}</p>
  </Alert>
)}
    </Container>
  );
};

export default CustomerDashboard;
