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

  const authToken = localStorage.getItem('authToken');
  const axiosConfig = { headers: { 'Authorization': `Bearer ${authToken}` } };

  useEffect(() => {
    axios.get('http://localhost:3000/api/items', axiosConfig)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error al cargar los productos:', error));
  }, []);

  useEffect(() => {
    const total = selectedProducts.reduce((sum, productId) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price : 0);
    }, 0);
    setPurchaseTotal(total);
  }, [selectedProducts, products]);

  const handleAddProduct = (productId) => {
    setSelectedProducts([...selectedProducts, productId]);
  };

  const handleVerifyCoupon = () => {
    axios.post('http://localhost:3000/api/customer/coupons/verify', { code: couponCode, purchase_total: purchaseTotal}, axiosConfig)
      .then(response => {
        const coupon = response.data;
        setCouponDetails(coupon);
        setErrorMessage('');
  
        if (coupon.count_used >= (coupon.max_count || Number.MAX_VALUE)) {
          setErrorMessage('Este cupón ha alcanzado su límite máximo de usos.');
          setDiscountAmount(0); 
          return;
        }
  
        if (purchaseTotal >= (coupon.min_purchase_value || 0)) {
          applyDiscount(coupon);
        } else {
          setErrorMessage('El valor de la compra no alcanza el mínimo requerido para el cupón.');
          setDiscountAmount(0); // Resetear el descuento si no se cumple el mínimo
        }
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Error verifying coupon.');
        setCouponDetails(null);
        setDiscountAmount(0); // Resetear el descuento en caso de error
      });
  };
  
  
  
  const isValidCoupon = (coupon) => {
    // Validar si el cupón se ha utilizado más veces de las permitidas
    if (coupon.count_used >= (coupon.max_count || Number.MAX_VALUE)) {
      alert('El cupón ha alcanzado su límite de uso.');
      return false;
    }
  
    // Validar el valor mínimo de compra para el cupón
    if (purchaseTotal < (coupon.min_purchase_value || 0)) {
      alert('El valor de la compra no alcanza el mínimo requerido para el cupón.');
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
      discountValue = Math.min(percentageDiscount, coupon.max_amount || percentageDiscount);
    }
  
    discountValue = Math.min(discountValue, purchaseTotal); 
  
    setDiscountAmount(discountValue);
  
    const finalTotal = purchaseTotal - discountValue;
    setPurchaseTotal(finalTotal);
  };
  
  
  
  
  const handlePurchase = () => {
    const purchaseData = {
        purchase: {
            items: selectedProducts.map(product => product.id), // Asegúrate de que esto envía los IDs de los productos
            coupon_code: couponDetails ? couponCode : undefined
        }
    };
  
    axios.post('http://localhost:3000/api/purchases', purchaseData, axiosConfig)
      .then(response => {
        alert('Compra realizada exitosamente');

        setSelectedProducts([]);
        setCouponCode('');
        setCouponDetails(null);
        setPurchaseTotal(0);
        setDiscountAmount(0);
      })
      .catch(error => {
        console.error('Error al realizar la compra:', error);
        alert('Error al realizar la compra. Por favor, inténtelo de nuevo.');
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
                <Card.Text>Precio: ${product.price}</Card.Text>
                <Button onClick={() => handleAddProduct(product.id)}>Agregar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div>
        <h3>Resumen de Compra</h3>
        <p>Total: ${purchaseTotal}</p>
        <p>Descuento: ${discountAmount}</p>
        <Button onClick={handlePurchase}>Comprar</Button>
      </div>

      <Form>
        <Form.Group>
          <Form.Label>Código de Cupón</Form.Label>
          <Form.Control 
            type="text" 
            value={couponCode} 
            onChange={e => setCouponCode(e.target.value)} 
          />
        </Form.Group>
        <Button onClick={handleVerifyCoupon}>Verificar Cupón</Button>
      </Form>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {couponDetails && (
  <Alert variant="success">
    <p>Cupón: {couponDetails.description || 'No especificado'}</p>
    <p>Tipo de Descuento: {couponDetails.discount_type}</p>
    <p>Valor de Descuento: {couponDetails.discount_value}</p>
    <p>Monto Máximo de Descuento: {couponDetails.max_amount || 'No especificado'}</p>
    <p>Valor Mínimo de Compra: {couponDetails.min_purchase_value || 'No especificado'}</p>
  </Alert>
)}
    </Container>
  );
};

export default CustomerDashboard;
