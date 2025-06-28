// client/pages/Login.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import auth from '../utils/auth.js';
import '../styles/Login.css';

const Login = () => {
  // State variables for form fields and error messages
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Submit handler to log in the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!emailOrUsername || !password) {
      setError('Please fill in both fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // Use auth service for better token management
        auth.login(data.token);
        console.log('Login successful', data);
      } else {
        setError(data.message || 'Something went wrong during login');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred while logging in. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center login-container" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="login-card p-4">
            <Card.Body>
              <h2 className="text-center login-title">Welcome Back</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmailOrUsername" className="mb-3">
                  <Form.Label>Email or Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                  <div className="helper-text">
                    💡 You can use either your email address or username
                  </div>
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={isLoading}
                  className="w-100 login-btn"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="register-link">Create one here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;