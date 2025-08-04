// client/pages/Settings.jsx
import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/Settings.css';

const Settings = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const settingsNavItems = [
    {
      path: '/settings/profile',
      title: 'Profile Settings',
      icon: "user",
      description: 'Edit your username, email address, or export your data'
    },
    {
      path: '/settings/security',
      title: 'Security & Password',
      icon: "shield-alt",
      description: 'Change or reset your password'
    },
    {
      path: '/settings/appearance',
      title: 'Appearance',
      icon: "palette",
      description: 'Customize light mode/dark mode, choose a color theme, or adjust accessibility settings'
    },
    {
      path: '/settings/danger-zone',
      title: 'Danger Zone',
      icon: "exclamation-triangle",
      description: 'Delete your account. This action is irreversible and will permanently remove all your data.'
    }
  ];

  return (
    <Container className="settings-container py-5">
      <Row>
        <Col lg={3} className="mb-4">
          <Card className="settings-sidebar">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FontAwesomeIcon icon="cog" className="me-2" />
                Settings
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                {settingsNavItems.map((item) => {
                  // Special handling for Profile Settings
                  if (item.path === '/settings/profile' && !isAuthenticated) {
                    return (
                      <div key={item.path} className="settings-nav-item disabled text-muted position-relative" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                        <div className="d-flex align-items-center">
                          <i className={`${item.icon} me-3`}></i>
                          <div>
                            <div className="fw-bold">{item.title}</div>
                            <small className="text-muted">{item.description}</small>
                          </div>
                        </div>
                        <div className="mt-1 small text-danger">
                          Please login or create an account to edit Profile Settings
                        </div>
                      </div>
                    );
                  }
                  // Special handling for Danger Zone
                  if (item.path === '/settings/danger-zone' && !isAuthenticated) {
                    return (
                      <div key={item.path} className="settings-nav-item disabled text-muted position-relative" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                        <div className="d-flex align-items-center">
                          <i className={`${item.icon} me-3`}></i>
                          <div>
                            <div className="fw-bold">{item.title}</div>
                            <small className="text-muted">{item.description}</small>
                          </div>
                        </div>
                        <div className="mt-1 small text-danger">
                          Please login to delete your account
                        </div>
                      </div>
                    );
                  }
                  // Normal nav link for all other items
                  return (
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
                  );
                })}
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
