// client/pages/settings/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../../utils/AuthContext';

const ProfileSettings = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        currentPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleSubmit = (action) => {
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!formData.currentPassword) {
      showAlert('Please enter your current password to confirm changes', 'danger');
      return;
    }

    setLoading(true);
    try {
      const endpoint = modalAction === 'username' ? '/api/users/update-username' : '/api/users/update-email';
      const body = {
        currentPassword: formData.currentPassword,
        [modalAction]: formData[modalAction]
      };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      showAlert(`${modalAction === 'username' ? 'Username' : 'Email'} updated successfully!`);
      setShowModal(false);
      setFormData(prev => ({ ...prev, currentPassword: '' }));
      
      // Update the user context with new data
      // You may need to refresh the token or update the user context here
      
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Profile Settings</h4>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-user me-2"></i>
            Account Information
          </h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />
                    <Button
                      className="btn-secondary"
                      onClick={() => handleSubmit('username')}
                      disabled={formData.username === user?.username || !formData.username.trim()}
                    >
                      Update
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Your username is used for login and must be unique.
                  </Form.Text>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                    <Button
                      className="btn-secondary"
                      onClick={() => handleSubmit('email')}
                      disabled={formData.email === user?.email || !formData.email.trim()}
                    >
                      Update
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Your email is used for login and account recovery.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are about to update your {modalAction}. Please enter your current password to confirm this change.
          </p>
          <Form.Group>
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            className="btn-primary" 
            onClick={confirmAction}
            disabled={loading || !formData.currentPassword}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Confirm Update'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileSettings;
