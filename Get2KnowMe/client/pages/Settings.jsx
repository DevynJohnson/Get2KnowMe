// client/pages/Settings.jsx
import React from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/Settings.css';

const Settings = () => {
  const location = useLocation();

  const settingsNavItems = [
    {
      path: '/settings/profile',
      title: 'Profile Settings',
      icon: 'fas fa-user',
      description: 'Edit your username and email'
    },
    {
      path: '/settings/security',
      title: 'Security & Password',
      icon: 'fas fa-shield-alt',
      description: 'Reset password and security settings'
    },
    {
      path: '/settings/appearance',
      title: 'Appearance',
      icon: 'fas fa-palette',
      description: 'Theme and display preferences'
    },
    {
      path: '/settings/danger-zone',
      title: 'Danger Zone',
      icon: 'fas fa-exclamation-triangle',
      description: 'Delete account and destructive actions'
    }
  ];

  return (
    <Container className="settings-container py-5">
      <Row>
        <Col lg={3} className="mb-4">
          <Card className="settings-sidebar">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Settings
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                {settingsNavItems.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`settings-nav-item ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <i className={`${item.icon} me-3`}></i>
                      <div>
                        <div className="fw-bold">{item.title}</div>
                        <small className="text-muted">{item.description}</small>
                      </div>
                    </div>
                  </Nav.Link>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={9}>
          <Card className="settings-content">
            <Card.Body className="p-4">
              <Outlet />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
