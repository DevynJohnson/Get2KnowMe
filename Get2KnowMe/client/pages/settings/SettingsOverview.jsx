// client/pages/settings/SettingsOverview.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SettingsOverview = () => {
  const settingsCards = [
    {
      path: '/settings/profile',
      title: 'Profile Settings',
      icon: 'fas fa-user',
      description: 'Update your username and email address',
      color: 'primary'
    },
    {
      path: '/settings/security',
      title: 'Security & Password',
      icon: 'fas fa-shield-alt',
      description: 'Change password and security settings',
      color: 'success'
    },
    {
      path: '/settings/appearance',
      title: 'Appearance',
      icon: 'fas fa-palette',
      description: 'Customize theme and display preferences',
      color: 'info'
    },
    {
      path: '/settings/danger-zone',
      title: 'Danger Zone',
      icon: 'fas fa-exclamation-triangle',
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
                  <i className={`${setting.icon} fa-2x text-${setting.color}`}></i>
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-1">{setting.title}</h5>
                  <p className="card-text text-muted mb-0 small">
                    {setting.description}
                  </p>
                </div>
                <div>
                  <i className="fas fa-chevron-right text-muted"></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-info-circle me-2"></i>
            Quick Tips
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6 className="text-primary">
                <i className="fas fa-lightbulb me-2"></i>
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
                <i className="fas fa-shield-alt me-2"></i>
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

      <style jsx>{`
        .settings-overview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-decoration: none;
        }
        
        .settings-overview-card {
          border: 1px solid #dee2e6;
          color: inherit;
        }
        
        .settings-overview-card:hover .card-title {
          color: #0d6efd;
        }
      `}</style>
    </>
  );
};

export default SettingsOverview;
