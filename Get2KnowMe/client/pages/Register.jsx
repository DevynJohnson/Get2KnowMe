// client/pages/Register.jsx
import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  // State variables for form fields and errors
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [consentError, setConsentError] = useState("");

  const navigate = useNavigate();

  // Password validation function
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

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Get the actual values from the form elements (handles autofill)
    const formData = new FormData(e.target);
    const emailValue = formData.get("email") || email;
    const usernameValue = formData.get("username") || username;
    const passwordValue = formData.get("password") || password;
    const confirmPasswordValue = formData.get("confirmPassword") || confirmPassword;

    // Update state with actual values if they were autofilled
    if (emailValue !== email) {
      setEmail(emailValue);
    }
    if (usernameValue !== username) {
      setUsername(usernameValue);
    }
    if (passwordValue !== password) {
      setPassword(passwordValue);
    }
    if (confirmPasswordValue !== confirmPassword) {
      setConfirmPassword(confirmPasswordValue);
    }

    if (!ageConfirmed || !agreedToTerms) {
      setError(
        "You must confirm age eligibility and agree to the Privacy Policy and Terms of Service."
      );
      setIsLoading(false);
      return;
    }

    if (!emailValue || !usernameValue || !passwordValue) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(passwordValue);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          username: usernameValue,
          password: passwordValue,
          consent: {
            ageConfirmed: ageConfirmed,
            agreedToTerms: agreedToTerms,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // Redirect to registration pending page
        navigate("/registration-pending");
        return;
      } else {
        // Handle specific HTTP status codes for better user experience
        if (response.status === 429) {
          setError("Too many registration attempts. Please wait 15 minutes before trying again.");
        } else if (response.status === 409) {
          setError("This email or username is already registered. Please try logging in instead.");
        } else if (response.status === 400) {
          setError(data.message || "Invalid registration data. Please check your information and try again.");
        } else if (response.status >= 500) {
          setError("Server error. Please try again in a few minutes.");
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server is unreachable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center register-container"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="register-card p-4">
            <Card.Body>
              <h2 className="text-center register-title">Create Account</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* Email Section */}
                <div className="form-section mb-3">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
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
                    <Form.Label>Username</Form.Label>
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
                    <Form.Label>Password</Form.Label>
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
                      💡 Must be 8+ characters with uppercase, lowercase, and
                      special character
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
                    label="I hereby confirm that I am at least 16 years of age (or at least 13 years of age in the UK)."
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
                        I agree to the{" "}
                        <Link to="/policy/terms-of-service">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/policy/UserInfo">Privacy Policy</Link>.
                      </>
                    }
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                </Form.Group>

                {consentError && <Alert variant="danger">{consentError}</Alert>}

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  className="w-100 register-btn"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </Form>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Login here
                  </Link>
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Under 16 (or 13 in the UK) but want to create an account?{" "}
                  <Link to="/parental-consent" className="login-link">
                   Verify parental/guardian consent here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
