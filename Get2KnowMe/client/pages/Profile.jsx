import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth.js";
import QRCodeGenerator from "../components/QRCodeGenerator.jsx";
import { usePassportData } from "../hooks/usePassportData.js";
import '../styles/Home.css';

const Profile = () => {
  const [showQRModal, setShowQRModal] = useState(false);

  // Get user info if logged in
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch {
    // User not logged in, redirect would be handled by route protection
    user = null;
  }

  // Use the optimized passport data hook
  const { hasPassport, isLoading, displayName, passportCode } = usePassportData();

  // If no user, show a message (this page should be protected)
  if (!user) {
    return (
      <Container className="home-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="home-card">
              <Card.Body className="text-center p-5">
                <h3>Please Log In</h3>
                <p>You need to be logged in to view your profile.</p>
                <Link to="/login" className="cta-button">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Main Profile Card */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5">
              <div className="welcome-message">
                {/* <h1 className="display-5 mb-3">
                  <i className="fas fa-user-circle me-2"></i>
                  My Profile
                </h1> */}
                <h3>
                  Hello, {displayName || user.username || user.email}!
                </h3>
                <p className="mb-4">
                  {isLoading
                    ? "Loading your passport status..."
                    : hasPassport
                    ? "This is where you can manage your Communication Passport and easily share it with others. Simply select Share My QR Code below and ask them to scan it with their smartphone camera and follow the link provided, or use the View Somebody's Passport option in this app to scan a QR code or enter your passcode." 
                    : "Create your Communication Passport to help others understand your communication needs."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="cta-buttons">
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
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions Card */}
          {hasPassport && (
            <Card className="home-card">
              <Card.Body className="p-4">
                <h5>
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <Link to="/settings/profile" className="quick-action-link">
                      <div className="quick-action-card">
                        <i className="fas fa-user-cog"></i>
                        <span>Account Settings</span>
                      </div>
                    </Link>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Link to="/settings/appearance" className="quick-action-link">
                      <div className="quick-action-card">
                        <i className="fas fa-palette"></i>
                        <span>Appearance</span>
                      </div>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
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

export default Profile;
