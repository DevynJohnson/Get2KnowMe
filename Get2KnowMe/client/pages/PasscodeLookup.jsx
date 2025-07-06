// client/pages/PasscodeLookup.jsx
import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner.jsx";
import "../styles/PasscodeLookup.css";

const PasscodeLookup = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passcode.trim()) {
      setError("Please enter a passcode");
      return;
    }

    setIsLoading(true);

    try {
      // Test if the passcode exists by making a request
      const response = await fetch(`/api/passport/public/${passcode.trim()}`);

      if (response.ok) {
        // Passcode is valid, navigate to the passport view
        navigate(`/passport/view/${passcode.trim()}`);
      } else if (response.status === 404) {
        setError("Passcode not found. Please check the code and try again.");
      } else {
        setError("Unable to verify passcode. Please try again later.");
      }
    } catch (err) {
      console.error("Error checking passcode:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPasscode = (value) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    // Add dashes every 4 characters for readability
    const formatted = cleaned.match(/.{1,4}/g)?.join("-") || cleaned;

    return formatted;
  };

  const handlePasscodeChange = (e) => {
    const formatted = formatPasscode(e.target.value);
    setPasscode(formatted);
  };

  const handleScanSuccess = (scannedPasscode) => {
    setPasscode(scannedPasscode);
    // Automatically submit the form with the scanned passcode
    handleSubmitWithPasscode(scannedPasscode);
  };

  const handleSubmitWithPasscode = async (codeToSubmit) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/passport/public/${codeToSubmit.trim()}`);

      if (response.ok) {
        navigate(`/passport/view/${codeToSubmit.trim()}`);
      } else if (response.status === 404) {
        setError("Passcode not found. Please check the code and try again.");
      } else {
        setError("Unable to verify passcode. Please try again later.");
      }
    } catch (err) {
      console.error("Error checking passcode:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="passcode-lookup-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5} xl={4}>
          <Card className="lookup-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="lookup-icon mb-3">
                  <i className="fas fa-search"></i>
                </div>
                <h2 className="lookup-title">Access Communication Passport</h2>
                <p className="text-muted">
                  Enter the passcode or scan the QR code that has been provided to view someone's Communication Passport
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Passcode Section */}
                <div className="form-section mb-4">
                  <Form.Group>
                    <Form.Label className="form-label">Passcode</Form.Label>
                    <Form.Control
                      type="text"
                      value={passcode}
                      onChange={handlePasscodeChange}
                      placeholder="Enter passcode (e.g., AB12-CD34)"
                      className="passcode-input"
                      maxLength={20}
                      autoComplete="off"
                      autoFocus
                    />
                    <Form.Text className="text-muted">
                      Enter the alphanumeric code provided to you here.
                    </Form.Text>
                  </Form.Group>
                </div>

                <Button
                  type="submit"
                  className="w-100 lookup-btn mb-3 btn-secondary"
                  disabled={isLoading || !passcode.trim()}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-eye me-2"></i>
                      View Passport
                    </>
                  )}
                </Button>

                {/* QR Scanner Button */}
                <div className="text-center mb-3">
                  <div className="divider-text">
                    <span className="text-muted small">OR</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="btn-secondary-reverse w-100"
                  size="lg"
                  onClick={() => setShowScanner(true)}
                >
                  <i className="fas fa-camera me-2"></i>
                  Scan QR Code
                </Button>
              </Form>

              <div className="text-center mt-4">
                <hr className="my-4" />
                <h6 className="text-muted mb-3">
                  What is a Communication Passport?
                </h6>
                <p className="small text-muted">
                  A Communication Passport provides important information about an individual including health alerts such as allergies or medical conditions, neurodivergent diagnoses, preferred communication methods or accommodations they may need in order to communicate effectively, potential triggers that may help avoid distress, and contact information for a trusted person who can assist them in difficult situations. This information can provide you with a better understanding of how to communicate with and support the individual, especially in emergency situations or when they are unable to communicate their needs themselves.
                </p>
              </div>

              <div className="emergency-notice mt-4 p-3">
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle text-warning mb-2"></i>
                  <h6 className="text-warning mb-2">Emergency Assistance</h6>
                  <p className="small text-muted mb-0">
                    If you need immediate support, contact the trusted person
                    listed in the Communication Passport or call emergency
                    services.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Don't have a passcode? Ask the individual to share their
              Communication Passport passcode with you by using the Share My QR Code button on the My Profile page.
            </p>
          </div>
        </Col>
      </Row>

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        show={showScanner}
        onHide={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
      />
    </Container>
  );
};

export default PasscodeLookup;
