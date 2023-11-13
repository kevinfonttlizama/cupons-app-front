import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row, InputGroup, FormControl } from 'react-bootstrap';

const CouponForm = ({ coupon = {}, refreshCoupons }) => {
  // Estado inicial para un nuevo cupón o para editar uno existente
  const [formData, setFormData] = useState({
    code: '',
    discount_type: '',
    discount_value: 0,
    max_amount: 0,
    min_purchase_value: 0,
    active: false,
    ...coupon
  });

  // Actualiza el estado del formulario si el cupón a editar cambia
  useEffect(() => {
    setFormData({ ...coupon });
  }, [coupon]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Verifica si el cupón es nuevo o uno existente
    const isEditing = coupon && coupon.id;
  
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `http://localhost:3000/api/coupons/${coupon.id}` : 'http://localhost:3000/api/coupons';

    axios[method](url, formData)
      .then(() => {
        refreshCoupons();
        // Resto de la lógica...
      })
      .catch(error => console.error('Error saving coupon: ', error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCode">
          <Form.Label>Coupon Code</Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter coupon code"
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridDiscountType">
          <Form.Label>Discount Type</Form.Label>
          <Form.Control
            as="select"
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            required
          >
            <option value="">Choose...</option>
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </Form.Control>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridDiscountValue">
          <Form.Label>Discount Value</Form.Label>
          <Form.Control
            type="number"
            name="discount_value"
            value={formData.discount_value}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridMaxAmount">
          <Form.Label>Max Amount</Form.Label>
          <Form.Control
            type="number"
            name="max_amount"
            value={formData.max_amount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridMinPurchase">
          <Form.Label>Min Purchase Value</Form.Label>
          <Form.Control
            type="number"
            name="min_purchase_value"
            value={formData.min_purchase_value}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridActive">
        <Form.Check
          type="checkbox"
          name="active"
          label="Active"
          checked={formData.active}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Coupon
      </Button>
    </Form>
  );
};

export default CouponForm;
