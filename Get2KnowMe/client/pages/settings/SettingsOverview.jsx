// client/pages/settings/SettingsOverview.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SettingsOverview = () => {
  const settingsCards = [
    {
      path: '/settings/profile',
      title: 'Profile Settings',
      icon: 'user',
      description: 'Update your username and email address',
      color: 'primary'
    },
    {
      path: '/settings/security',
      title: 'Security & Password',
      icon: 'shield-alt',
      description: 'Change password and security settings',
      color: 'success'
    },
    {
      path: '/settings/appearance',
      title: 'Appearance',
      icon: 'palette',
      description: 'Customize theme and display preferences',
      color: 'info'
    },
    {
      path: '/settings/danger-zone',
      title: 'Danger Zone',
      icon: 'exclamation-triangle',
      description: 'Account deletion and destructive actions',
      color: 'danger'
    }
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Settings Overview</h4>
      </div>

      <p className="text-muted mb-4">
        Manage your account settings, security, and preferences. Select a category below to get started.
      </p>

      <Row>
        {settingsCards.map((setting) => (
          <Col md={6} lg={6} key={setting.path} className="mb-4">
            <Card 
              as={Link} 
              to={setting.path} 
              className="h-100 text-decoration-none settings-overview-card"
              style={{ transition: 'all 0.3s ease' }}
            >
              <Card.Body className="d-flex align-items-center">
                <div className={`rounded-circle p-3 me-3 bg-${setting.color} bg-opacity-10`}>
                  <FontAwesomeIcon icon={setting.icon} className={`fa-2x text-${setting.color}`} />
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1">{setting.title}</h5>
                  <p className="card-text text-muted mb-0 small">
                    {setting.description}
                  </p>
                </div>
                <div>
                  <FontAwesomeIcon icon="chevron-right" className="text-muted" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">
            <FontAwesomeIcon icon="info-circle" className="me-2" />
            Quick Tips
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6 className="text-primary">
                <FontAwesomeIcon icon="lightbulb" className="me-2" />
                Security Best Practices
              </h6>
              <ul className="small text-muted">
                <li>Use a strong, unique password</li>
                <li>Update your password regularly</li>
                <li>Keep your email address current</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="text-success">
                <FontAwesomeIcon icon="shield-alt" className="me-2" />
                Account Safety
              </h6>
              <ul className="small text-muted">
                <li>Never share your login credentials</li>
                <li>Log out from shared devices</li>
                <li>Review your settings periodically</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SettingsOverview;
