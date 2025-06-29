import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthService from '../utils/auth.js';

const Home = () => {
  const [hasPassport, setHasPassport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passportName, setPassportName] = useState('');

  // Get user info if logged in
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch {
    // User not logged in, that's fine
    user = null;
  }

  // Check if user has existing passport
  useEffect(() => {
    const checkExistingPassport = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const token = AuthService.getToken();
        const response = await fetch('/api/passport/my-passport', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHasPassport(true);
          // Use preferred name, fallback to first name
          const displayName = data.passport.preferredName || data.passport.firstName;
          setPassportName(displayName || '');
        } else {
          setHasPassport(false);
          setPassportName('');
        }
      } catch (err) {
        console.error('Error checking passport:', err);
        setHasPassport(false);
        setPassportName('');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingPassport();
  }, [user]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Main Welcome Card */}
          <Card className="text-center shadow-sm mb-4">
            <Card.Body className="p-5">
              <h1 className="display-4 mb-4" style={{ color: '#007bff' }}>
                Welcome to Get2KnowMe
              </h1>
              
              {user ? (
                <div>
                  <p className="lead mb-4">
                    Hello, <strong>{passportName || user.username || user.email}</strong>! 
                    {isLoading ? ' Loading your passport status...' : 
                     hasPassport ? ' Need to update your Communication Passport? Click below to edit your details or view another person\'s passport.' : 
                     ' Ready to create your Communication Passport?'}
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Button 
                      as={Link} 
                      to="/create-passport" 
                      variant="primary" 
                      size="lg"
                      className="px-4"
                      disabled={isLoading}
                    >
                      <i className={`fas ${hasPassport ? 'fa-edit' : 'fa-id-card'} me-2`}></i>
                      {isLoading ? 'Loading...' : (hasPassport ? 'Edit My Passport' : 'Create My Passport')}
                    </Button>
                    <Button 
                      as={Link} 
                      to="/passport-lookup" 
                      variant="outline-primary" 
                      size="lg"
                      className="px-4"
                    >
                      <i className="fas fa-search me-2"></i>
                      View Someone's Passport
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="lead mb-4">
                    A tool for neurodivergent individuals to create Communication Passports 
                    that help others understand their communication needs and preferences.
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="primary" 
                      size="lg"
                      className="px-4"
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Get Started
                    </Button>
                    <Button 
                      as={Link} 
                      to="/passport-lookup" 
                      variant="outline-primary" 
                      size="lg"
                      className="px-4"
                    >
                      <i className="fas fa-search me-2"></i>
                      View a Passport
                    </Button>
                  </div>
                  <p className="text-muted">
                    Already have an account? <Link to="/login">Sign in here</Link>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Feature Cards */}
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="fas fa-comments fa-3x"></i>
                  </div>
                  <h4 className="mb-3">Communication Preferences</h4>
                  <p className="text-muted">
                    Share your preferred communication methods, accommodations needed, 
                    and topics to avoid for better interactions.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-3">
                    <i className="fas fa-user-shield fa-3x"></i>
                  </div>
                  <h4 className="mb-3">Trusted Support</h4>
                  <p className="text-muted">
                    Include contact information for a trusted person who can 
                    provide additional support when needed.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-warning mb-3">
                    <i className="fas fa-qrcode fa-3x"></i>
                  </div>
                  <h4 className="mb-3">Easy Access</h4>
                  <p className="text-muted">
                    Generate a unique passcode that others can use to quickly 
                    access your Communication Passport when needed.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="text-info mb-3">
                    <i className="fas fa-heart fa-3x"></i>
                  </div>
                  <h4 className="mb-3">Better Connections</h4>
                  <p className="text-muted">
                    Foster understanding and create more positive social 
                    interactions by sharing your communication needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Call to Action */}
          <Card className="mt-4 bg-light border-0">
            <Card.Body className="text-center p-4">
              <h5 className="mb-3">Ready to Get Started?</h5>
              <p className="text-muted mb-4">
                Join our community and create your Communication Passport today to help 
                others understand and support your communication needs.
              </p>
              {!user && (
                <Button as={Link} to="/register" variant="primary" size="lg">
                  Create Your Account
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
