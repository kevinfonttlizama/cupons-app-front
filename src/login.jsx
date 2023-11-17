import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // ...

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/sign_in', {
        user: credentials
      });
      const { token, role } = response.data;
      if (token) {
        onLoginSuccess(token, role);
      } else {
        console.error('Login failed: Token not provided in response');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };
  
  
  
  
  

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm({ ...registrationForm, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registrationForm.password !== registrationForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/users', {
        user: {
          email: registrationForm.email,
          password: registrationForm.password,
          password_confirmation: registrationForm.confirmPassword,
        }
      });

      setShowRegisterModal(false);

    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };
  
  

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title className="text-center">Login</Card.Title>
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleLoginChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
                <div className="mt-3 text-center">
                  <span
                    style={{ color: '#0275d8', cursor: 'pointer' }}
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Don't have an account? Register here
                  </span>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterSubmit}>
            {/* Form fields for registration */}
            <Form.Group controlId="registrationEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={registrationForm.email}
                onChange={handleRegisterChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="registrationPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={registrationForm.password}
                onChange={handleRegisterChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group controlId="registrationConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={registrationForm.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Confirm Password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default Login;
