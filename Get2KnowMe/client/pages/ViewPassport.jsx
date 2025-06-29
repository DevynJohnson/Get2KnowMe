// client/pages/ViewPassport.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ViewPassport.css';

const ViewPassport = () => {
  const { passcode } = useParams();
  const navigate = useNavigate();
  
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (passcode) {
      fetchPassport(passcode);
    } else {
      setError('No passcode provided');
      setLoading(false);
    }
  }, [passcode]);

  const fetchPassport = async (code) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/passport/public/${code}`);
      
      if (response.ok) {
        const data = await response.json();
        setPassport(data.passport);
      } else if (response.status === 404) {
        setError('Communication Passport not found. Please check the passcode and try again.');
      } else {
        setError('Unable to load Communication Passport. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching passport:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayDiagnosis = () => {
    if (passport.diagnosis === 'Other' && passport.customDiagnosis) {
      return passport.customDiagnosis;
    }
    return passport.diagnosis;
  };

  if (loading) {
    return (
      <Container className="view-passport-container d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading Communication Passport...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="view-passport-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="danger" className="text-center">
              <Alert.Heading>Unable to Load Passport</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => navigate('/')}>
                Return to Homepage
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!passport) {
    return (
      <Container className="view-passport-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="warning" className="text-center">
              <Alert.Heading>Passport Not Found</Alert.Heading>
              <p>The requested Communication Passport could not be found.</p>
              <Button variant="outline-warning" onClick={() => navigate('/')}>
                Return to Homepage
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="view-passport-container py-4">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="passport-display-card">
            <Card.Header className="passport-header text-center">
              <div className="passport-icon mb-2">
                <i className="fas fa-id-card"></i>
              </div>
              <h2 className="passport-name">
                {passport.preferredName || passport.firstName} {passport.lastName}
              </h2>
              <Badge bg="primary" className="passport-badge">Communication Passport</Badge>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Diagnosis Section */}
              <div className="passport-section mb-4">
                <div className="section-header">
                  <i className="fas fa-stethoscope section-icon"></i>
                  <h4 className="section-title">Diagnosis</h4>
                </div>
                <div className="section-content">
                  <Badge bg="info" className="diagnosis-badge">
                    {getDisplayDiagnosis()}
                  </Badge>
                </div>
              </div>

              {/* Communication Preferences Section */}
              {passport.communicationPreferences && passport.communicationPreferences.length > 0 && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <i className="fas fa-comments section-icon"></i>
                    <h4 className="section-title">Communication Preferences</h4>
                  </div>
                  <div className="section-content">
                    <ul className="preferences-list">
                      {passport.communicationPreferences.map((preference, index) => (
                        <li key={index} className="preference-item">
                          <i className="fas fa-check-circle preference-icon"></i>
                          {preference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Words to Avoid Section */}
              {passport.avoidWords && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <i className="fas fa-exclamation-triangle section-icon text-warning"></i>
                    <h4 className="section-title">Words/Phrases/Topics to Avoid</h4>
                  </div>
                  <div className="section-content">
                    <div className="avoid-words-box">
                      {passport.avoidWords}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Preferences Section */}
              {passport.customPreferences && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <i className="fas fa-plus-circle section-icon"></i>
                    <h4 className="section-title">Additional Preferences</h4>
                  </div>
                  <div className="section-content">
                    <div className="custom-preferences-box">
                      {passport.customPreferences}
                    </div>
                  </div>
                </div>
              )}

              {/* Trusted Contact Section */}
              {passport.trustedContact && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <i className="fas fa-user-shield section-icon text-success"></i>
                    <h4 className="section-title">Trusted Contact</h4>
                  </div>
                  <div className="section-content">
                    <div className="trusted-contact-card">
                      <div className="contact-info">
                        <div className="contact-name">
                          <i className="fas fa-user contact-icon"></i>
                          <strong>{passport.trustedContact.name}</strong>
                        </div>
                        <div className="contact-phone">
                          <i className="fas fa-phone contact-icon"></i>
                          <a href={`tel:${passport.trustedContact.phone}`}>
                            {passport.trustedContact.phone}
                          </a>
                        </div>
                        {passport.trustedContact.email && (
                          <div className="contact-email">
                            <i className="fas fa-envelope contact-icon"></i>
                            <a href={`mailto:${passport.trustedContact.email}`}>
                              {passport.trustedContact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Information Section */}
              {passport.otherInformation && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <i className="fas fa-info-circle section-icon"></i>
                    <h4 className="section-title">Additional Information</h4>
                  </div>
                  <div className="section-content">
                    <div className="other-info-box">
                      {passport.otherInformation}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="passport-footer mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-clock"></i>
                    Last updated: {formatDate(passport.updatedAt)}
                  </small>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-print"></i> Print
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Emergency Notice */}
          <Alert variant="info" className="mt-3 text-center">
            <Alert.Heading className="h6">
              <i className="fas fa-info-circle"></i> Important Notice
            </Alert.Heading>
            <p className="mb-0 small">
              In case of emergency or if additional support is needed, 
              please contact the trusted person listed above.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewPassport;
