// client/pages/settings/DangerZone.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const DangerZone = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmText: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeleteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleDeleteAccount = async () => {
    if (deleteForm.confirmText !== 'DELETE MY ACCOUNT') {
      showAlert('Please type "DELETE MY ACCOUNT" exactly to confirm', 'danger');
      return;
    }

    if (!deleteForm.password) {
      showAlert('Please enter your password to confirm account deletion', 'danger');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: deleteForm.password,
          confirmText: deleteForm.confirmText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account deletion failed');
      }

      // Account deleted successfully
      showAlert('Account deleted successfully. Redirecting...', 'success');
      
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
      
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const isDeleteReady = deleteForm.password && deleteForm.confirmText === 'DELETE MY ACCOUNT';

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-danger">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          Danger Zone
        </h4>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card className="border-danger">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0">
            <FontAwesomeIcon icon="trash-alt" className="me-2" />
            Delete Account
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="alert alert-warning">
            <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
            <strong>Warning:</strong> This action cannot be undone!
          </div>

          <p className="text-muted mb-4">
            Deleting your account will permanently remove:
          </p>

          <ul className="text-muted mb-4">
            <li>Your user profile and login credentials</li>
            <li>Your communication passport (if created)</li>
            <li>All personal information and preferences</li>
            <li>Access to your account and all associated data</li>
          </ul>

          <div className="border rounded p-4 bg-light">
            <h6 className="text-danger mb-3">Are you absolutely sure?</h6>
            <p className="small text-muted mb-3">
              This will permanently delete your account and all associated data. 
              This action cannot be undone.
            </p>

            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
              className="btn-lg"
            >
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
              I want to delete my account
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-danger text-white">
          <Modal.Title>
            <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
            Confirm Account Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-danger">
            <strong>Final Warning:</strong> This action will permanently delete your account and cannot be undone!
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Type <strong>DELETE MY ACCOUNT</strong> to confirm:
              </Form.Label>
              <Form.Control
                type="text"
                name="confirmText"
                value={deleteForm.confirmText}
                onChange={handleInputChange}
                placeholder="Type: DELETE MY ACCOUNT"
                className="font-monospace"
              />
              <Form.Text className="text-muted">
                This must be typed exactly as shown above.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Enter your password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={deleteForm.password}
                onChange={handleInputChange}
                placeholder="Enter your account password"
              />
            </Form.Group>
          </Form>

          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="text-danger">What will happen:</h6>
            <ul className="small mb-0">
              <li>Your account will be immediately deleted</li>
              <li>You will be logged out and redirected to the home page</li>
              <li>All your data will be permanently removed from our servers</li>
              <li>You will need to create a new account to use the service again</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount}
            disabled={loading || !isDeleteReady}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting Account...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon="trash-alt" className="me-2" />
                Delete My Account Forever
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DangerZone;
