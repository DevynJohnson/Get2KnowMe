import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AuthService from '../utils/auth.js';

const Home = () => {
  // Get user info if logged in
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch {
    // User not logged in, that's fine
    user = null;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body className="p-5">
              <h1 className="display-4 mb-4" style={{ color: '#007bff' }}>
                Welcome to Get2KnowMe
              </h1>
              
              {user ? (
                <div>
                  <p className="lead mb-4">
                    Hello, <strong>{user.username || user.email}</strong>! 
                    You're successfully logged in.
                  </p>
                  <p className="text-muted">
                    This is your dashboard where you can manage your profile and connect with others.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="lead mb-4">
                    A tool for neurodivergent individuals to help others understand their communication needs, fostering more positive social interactions and helping build meaningful connections.
                  </p>
                  <p className="text-muted">
                    Please <strong>login</strong> or <strong>register</strong> using the navigation above to get started.
                  </p>
                </div>
              )}
              
              <hr className="my-4" />
              
              <div className="text-muted">
                <small>
                  {user ? (
                    <>🎉 Authentication working perfectly!</>
                  ) : (
                    <>🚀 Ready to test registration and login</>
                  )}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
