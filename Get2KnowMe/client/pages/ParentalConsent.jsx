// client/pages/ParentalConsent.jsx
import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Modal
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Register.css";
import "../styles/ParentalConsent.css";

const ParentalConsent = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [confirmParentEmail, setConfirmParentEmail] = useState("");
  const [modalError, setModalError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
      return "Password must contain at least one special character";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!ageConfirmed || !agreedToTerms) {
      setError(
        "You must confirm age eligibility and agree to the Privacy Policy and Terms of Service."
      );
      setIsLoading(false);
      return;
    }
    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    setShowModal(true);
    setIsLoading(false);
  };

  const handleSendConsentEmail = async () => {
    setModalError("");
    if (!parentEmail) {
      setModalError("Please enter a parent or guardian's email address.");
      return;
    }
    if (parentEmail !== confirmParentEmail) {
      setModalError("Parent/guardian email addresses do not match.");
      return;
    }
    if (parentEmail === email) {
      setModalError("Your email address and your parent/guardian's email address cannot be the same.");
      return;
    }
    try {
      setIsLoading(true);
      
      const response = await fetch("http://get2know.me/api/users/start-parental-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childEmail: email,
          childUsername: username,
          password,
          parentEmail
        })
      });
      if (!response.ok) {
        const data = await response.json();
        setModalError(data.message || "Failed to send email");
        setIsLoading(false);
        return;
      }
      setEmailSent(true);
    } catch (err) {
      setModalError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="parental-consent-container"
    >
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="parental-consent-card">
            <Card.Body>
              <h2 className="parental-consent-title">Parental Consent</h2>
              <p>This form will allow you to request consent from your parent or guardian to create an account with Get2KnowMe under the age of 16 (or 13 in the UK). If you are over the age of 16 (or 13 in the UK), please return to the <a href="/register">main registration page</a> and create an account.</p>
              <p> Please enter the information you want to use for your account below, followed by your parent or guardian's email address, and click "Submit and Send Request" below. This will send an email to your parent or guardian, and your account registration will be complete once they have provided their consent.</p>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* Email Section */}
                <div className="form-section mb-3">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Your Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </Form.Group>
                </div>
                {/* Username Section */}
                <div className="form-section mb-3">
                  <Form.Group controlId="formUsername">
                    <Form.Label>Your Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Create Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </Form.Group>
                </div>
                {/* Password Section */}
                <div className="form-section mb-4">
                  <Form.Group controlId="formPassword">
                    <Form.Label>Your Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Create your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <div className="helper-text">
                      💡 Must be 8+ characters with uppercase, lowercase, and special character
                    </div>
                  </Form.Group>
                </div>
                {/* Confirm Password Section */}
                <div className="form-section mb-4">
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      isInvalid={confirmPassword && password !== confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <Form.Group controlId="formAgeConfirmed" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="I hereby confirm that I am under 16 years of age (or under 13 in the UK) and require parental or guardian consent to use this application."
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAgreedToTerms" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        I agree to the {" "}
                        <Link to="/legal/terms-of-service">Terms of Service</Link>{" "}
                        and {" "}
                        <Link to="/legal/privacy-policy">Privacy Policy</Link>.
                      </>
                    }
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  className="w-100 parental-consent-btn"
                >
                  {isLoading ? "Processing..." : "Request Parental Consent"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Modal for parent/guardian email */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="parental-consent-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Parent/Guardian Consent Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {emailSent ? (
            <div className="text-center">
              <h5>Consent Request Sent!</h5>
              <p>
                An email has been sent to <strong>{parentEmail}</strong> with instructions for providing consent. Please note that misrepresentation of your parent or guardian's email address is a violation of our Terms of Service, and accounts found to be created without proper consent will immediately be deactivated and all user data for that account will be permanently deleted.
              </p>
            </div>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Parent or Guardian's Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Enter parent or guardian's email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Parent or Guardian's Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={confirmParentEmail}
                  onChange={(e) => setConfirmParentEmail(e.target.value)}
                  placeholder="Re-enter parent or guardian's email"
                  required
                  isInvalid={confirmParentEmail && parentEmail !== confirmParentEmail}
                />
                <Form.Control.Feedback type="invalid">
                  Email addresses do not match
                </Form.Control.Feedback>
              </Form.Group>
              {modalError && <Alert variant="danger">{modalError}</Alert>}
              <Button
                variant="primary"
                className="w-100 parental-consent-btn mb-3"
                onClick={handleSendConsentEmail}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Consent Request"}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ParentalConsent;
