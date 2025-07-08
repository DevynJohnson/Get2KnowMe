// client/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card, Container, Row, Col, Spinner } from 'react-bootstrap';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get('token');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'danger' });
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, message: '', variant: 'danger' });
    if (!token) {
      setAlert({ show: true, message: 'Invalid or missing token.', variant: 'danger' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ show: true, message: 'Passwords do not match.', variant: 'danger' });
      return;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setAlert({ show: true, message: passwordError, variant: 'danger' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setAlert({ show: true, message: 'Password reset successful! You can now log in.', variant: 'success' });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setAlert({ show: true, message: data.message || 'Password reset failed.', variant: 'danger' });
      }
    } catch {
      setAlert({ show: true, message: 'Server error. Please try again later.', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Reset Password</h2>
              {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
              {!success && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? <><Spinner animation="border" size="sm" className="me-2" />Resetting...</> : 'Reset Password'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
