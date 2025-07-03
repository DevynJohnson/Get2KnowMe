import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth.js";
import QRCodeGenerator from "../components/QRCodeGenerator.jsx";
import { usePassportData } from "../hooks/usePassportData.js";
import '../styles/Home.css';

const Home = () => {
  const [showQRModal, setShowQRModal] = useState(false);

  // Get user info if logged in
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch {
    // User not logged in, that's fine
    user = null;
  }

  // Use the optimized passport data hook
  const { hasPassport, isLoading, displayName, passportCode } = usePassportData();

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Main Welcome Card */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5">
              {!user && (
                <h1 className="display-4 home-title">
                  Welcome to Get2KnowMe
                </h1>
              )}

              {user ? (
                <div className="welcome-message">
                  <h3>
                    <i className="fas fa-user-circle me-2"></i>
                    Hello, {displayName || user.username || user.email}!
                  </h3>
                  <p className="mb-0">
                    {isLoading
                      ? "Loading your passport status..."
                      : hasPassport
                      ? "Need to update your Communication Passport? Click below to edit your details or view another person's passport."
                      : "Ready to create your Communication Passport?"}
                  </p>
                </div>
              ) : (
                <div className="guest-message">
                  <h3>
                    <i className="fas fa-heart me-2"></i>
                    Create Better Connections
                  </h3>
                  <p className="mb-0">
                    A tool for neurodivergent individuals to create
                    Communication Passports that help others understand their
                    communication needs and preferences.
                  </p>
                </div>
              )}

              {/* Feature List - Only show for non-authenticated users */}
              {!user && (
                <ul className="feature-list">
                  <li>
                    <div className="feature-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    Share your communication preferences and accommodations
                  </li>
                  <li>
                    <div className="feature-icon">
                      <i className="fas fa-user-shield"></i>
                    </div>
                    Include trusted contact information for support
                  </li>
                  <li>
                    <div className="feature-icon">
                      <i className="fas fa-qrcode"></i>
                    </div>
                    Generate QR codes for easy passport sharing
                  </li>
                  <li>
                    <div className="feature-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    Foster understanding and positive interactions
                  </li>
                </ul>
              )}

              {/* Action Buttons */}
              <div className="cta-buttons">
                {user ? (
                  <>
                    <Link
                      to="/create-passport"
                      className={`cta-button ${isLoading ? 'disabled' : ''}`}
                    >
                      <i className={`fas ${hasPassport ? "fa-edit" : "fa-id-card"}`}></i>
                      {isLoading
                        ? "Loading..."
                        : hasPassport
                        ? "Edit My Passport"
                        : "Create My Passport"}
                    </Link>
                    <Link to="/passport-lookup" className="cta-button secondary">
                      <i className="fas fa-search"></i>
                      View Someone's Passport
                    </Link>
                    {hasPassport && passportCode && (
                      <button
                        className="cta-button accent"
                        onClick={() => setShowQRModal(true)}
                        title="Generate QR code to share your passport"
                      >
                        <i className="fas fa-qrcode"></i>
                        Share My QR Code
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" className="cta-button">
                      <i className="fas fa-user-plus"></i>
                      Get Started
                    </Link>
                    <Link to="/passport-lookup" className="cta-button secondary">
                      <i className="fas fa-search"></i>
                      View a Passport
                    </Link>
                  </>
                )}
              </div>

              {!user && (
                <p className="text-muted text-center mt-3 mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-medium">
                    Sign in here
                  </Link>
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* QR Code Generator Modal */}
      {hasPassport && passportCode && (
        <QRCodeGenerator
          show={showQRModal}
          onHide={() => setShowQRModal(false)}
          passcode={passportCode}
          passportName={displayName}
        />
      )}
    </Container>
  );
};

export default Home;
