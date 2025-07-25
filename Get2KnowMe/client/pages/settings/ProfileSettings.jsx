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
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    allowFollowRequests: true,
    showInSearch: true
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        currentPassword: ''
      });
      
      // Set privacy settings from user data
      if (user.privacySettings) {
        setPrivacySettings({
          allowFollowRequests: user.privacySettings.allowFollowRequests ?? true,
          showInSearch: user.privacySettings.showInSearch ?? true
        });
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
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

  // Privacy settings update handler
  const updatePrivacySettings = async () => {
    setPrivacyLoading(true);
    try {
      const response = await fetch('/api/users/update-privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ privacySettings })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Privacy settings update failed');
      }

      showAlert('Privacy settings updated successfully!');
      
    } catch (error) {
      showAlert(error.message, 'danger');
      // Revert changes on error
      if (user?.privacySettings) {
        setPrivacySettings({
          allowFollowRequests: user.privacySettings.allowFollowRequests ?? true,
          showInSearch: user.privacySettings.showInSearch ?? true
        });
      }
    } finally {
      setPrivacyLoading(false);
    }
  };

  // Add export handler
  async function handleExport() {
    if (!formData.currentPassword) {
      showAlert('Please enter your current password to export your data', 'danger');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/users/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.currentPassword })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Export failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'get2knowme_data_export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showAlert('Your data has been exported successfully!');
      setShowModal(false);
      setFormData(prev => ({ ...prev, currentPassword: '' }));
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Check if privacy settings have changed
  const privacySettingsChanged = user?.privacySettings ? (
    privacySettings.allowFollowRequests !== (user.privacySettings.allowFollowRequests ?? true) ||
    privacySettings.showInSearch !== (user.privacySettings.showInSearch ?? true)
  ) : false;

  return (
    <>
      <div className="settings-title d-flex justify-content-between align-items-center mb-4">
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

      {/* Privacy Settings Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-shield-alt me-2"></i>
            Privacy Settings
          </h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="row">
              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="allowFollowRequests"
                    name="allowFollowRequests"
                    label="Allow follow requests"
                    checked={privacySettings.allowFollowRequests}
                    onChange={handlePrivacyChange}
                  />
                  <Form.Text className="text-muted d-block mt-1">
                    When enabled, other users can send you follow requests to connect with you.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="showInSearch"
                    name="showInSearch"
                    label="Show in search results"
                    checked={privacySettings.showInSearch}
                    onChange={handlePrivacyChange}
                  />
                  <Form.Text className="text-muted d-block mt-1">
                    When enabled, other users will be able to find your profile when searching for users.
                  </Form.Text>
                </Form.Group>

                {privacySettingsChanged && (
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      onClick={updatePrivacySettings}
                      disabled={privacyLoading}
                    >
                      {privacyLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Privacy Settings
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Data Export Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-download me-2"></i>
            Export My Data
          </h5>
        </Card.Header>
        <Card.Body>
          <p>You can export all data stored about your account and communication passport. For your security, please verify your password before exporting.</p>
          <Button className="btn-primary" onClick={() => { setModalAction('export'); setShowModal(true); }}>
            <i className="fas fa-file-export me-2"></i>
            Export My Data
          </Button>
        </Card.Body>
      </Card>

      {/* Confirmation & Export Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction === 'export' ? 'Export My Data' : 'Confirm Changes'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === 'export' ? (
            <>
              <p>Enter your current password to export your data.</p>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            className="btn-primary"
            onClick={modalAction === 'export' ? handleExport : confirmAction}
            disabled={loading || !formData.currentPassword}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {modalAction === 'export' ? 'Exporting...' : 'Updating...'}
              </>
            ) : (
              modalAction === 'export' ? 'Export My Data' : 'Confirm Update'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileSettings;