// client/pages/settings/SecuritySettings.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';

const SecuritySettings = () => {
  const { token, isAuthenticated } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetEmailForm, setResetEmailForm] = useState({
    email: ''
  });
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetEmailChange = (e) => {
    setResetEmailForm({ email: e.target.value });
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showAlert('You must be logged in to change your password.', 'danger');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert('New passwords do not match', 'danger');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showAlert('Password must be at least 8 characters long', 'danger');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }
      showAlert('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmailForm.email) {
      showAlert('Please enter your email address', 'danger');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: resetEmailForm.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset request failed');
      }

      showAlert('Password reset email sent! Check your inbox for instructions.');
      setShowResetModal(false);
      setResetEmailForm({ email: '' });
      
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const hasMinLength = password.length >= 8;

    return { hasUpperCase, hasLowerCase, hasSpecialChar, hasMinLength };
  };

  const passwordValidation = validatePassword(passwordForm.newPassword);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Security & Password</h4>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Change Password Card (only visible to authenticated users) */}
      {isAuthenticated && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="fas fa-key me-2"></i>
              Change Password
            </h5>
          </Card.Header>
          <Card.Body>
            {/* ...existing code for change password form... */}
            <Form onSubmit={handlePasswordChange}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter current password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter new password"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <div className="password-requirements">
                    <h6 className="mb-3">Password Requirements:</h6>
                    <ul className="list-unstyled">
                      <li className={passwordValidation.hasMinLength ? 'text-success' : 'text-muted'}>
                        <i className={`fas ${passwordValidation.hasMinLength ? 'fa-check' : 'fa-times'} me-2`}></i>
                        At least 8 characters long
                      </li>
                      <li className={passwordValidation.hasUpperCase ? 'text-success' : 'text-muted'}>
                        <i className={`fas ${passwordValidation.hasUpperCase ? 'fa-check' : 'fa-times'} me-2`}></i>
                        One uppercase letter
                      </li>
                      <li className={passwordValidation.hasLowerCase ? 'text-success' : 'text-muted'}>
                        <i className={`fas ${passwordValidation.hasLowerCase ? 'fa-check' : 'fa-times'} me-2`}></i>
                        One lowercase letter
                      </li>
                      <li className={passwordValidation.hasSpecialChar ? 'text-success' : 'text-muted'}>
                        <i className={`fas ${passwordValidation.hasSpecialChar ? 'fa-check' : 'fa-times'} me-2`}></i>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="btn-primary"
                disabled={loading || !isPasswordValid || passwordForm.newPassword !== passwordForm.confirmPassword}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Password Reset Card */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-envelope me-2"></i>
            Password Reset
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-3">
            Forgot your password? Send a password reset email to your registered email address.
          </p>
          <Button 
            className="btn-secondary" 
            onClick={() => setShowResetModal(true)}
          >
            <i className="fas fa-paper-plane me-2"></i>
            Send Password Reset Email
          </Button>
        </Card.Body>
      </Card>

      {/* Password Reset Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Password Reset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={resetEmailForm.email}
              onChange={handleResetEmailChange}
              placeholder="Enter your email address"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePasswordReset}
            disabled={loading || !resetEmailForm.email}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              'Send Reset Email'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SecuritySettings;
