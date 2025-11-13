import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/auth.js';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await register(formData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="register-card">
            <Card.Header className="register-header text-center">
              <h2>Create Account</h2>
            </Card.Header>
            <Card.Body className="register-form">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 register-button"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="register-footer text-center">
              <p>Already have an account? <Link to="/login" className="register-link">Login</Link></p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
