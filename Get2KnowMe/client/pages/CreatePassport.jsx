// client/pages/CreatePassport.jsx
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import auth from "../utils/auth.js";
import QRCodeGenerator from "../components/QRCodeGenerator.jsx";
import "../styles/CreatePassport.css";

const CreatePassport = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    diagnosis: "",
    customDiagnosis: "",
    communicationPreferences: [],
    avoidWords: "",
    customPreferences: "",
    trustedContact: {
      name: "",
      phone: "",
      email: "",
    },
    profilePasscode: "",
    otherInformation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Diagnosis options
  const diagnosisOptions = [
    "ASD (Autism Spectrum Disorder)",
    "ADHD",
    "OCD",
    "Dyslexia",
    "Tourette's Syndrome",
    "Other",
  ];

  // Communication preference options
  const preferenceOptions = [
    "Speak slowly",
    "Allow extra time to process",
    "Avoid complicated questions or confusing language",
    "Avoid specific words/phrases/topics",
    "Other",
  ];

  // Check if user is authenticated
  useEffect(() => {
    if (!auth.loggedIn()) {
      navigate("/login");
      return;
    }

    // Load existing passport if it exists
    loadExistingPassport();
  }, [navigate]);

  const loadExistingPassport = async () => {
    try {
      const token = auth.getToken();
      const response = await fetch("/api/passport/my-passport", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data.passport);
        setIsEditing(true);
      }
      // If 404, user doesn't have a passport yet - that's fine
    } catch (err) {
      console.error("Error loading existing passport:", err);
    }
  };

  const generatePasscode = async () => {
    try {
      const response = await fetch("/api/passport/generate-passcode");
      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          profilePasscode: data.passcode,
        }));
      }
    } catch (err) {
      console.error("Error generating passcode:", err);
      setError("Failed to generate passcode");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("trustedContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        trustedContact: {
          ...prev.trustedContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePreferenceChange = (preference) => {
    setFormData((prev) => ({
      ...prev,
      communicationPreferences: prev.communicationPreferences.includes(
        preference
      )
        ? prev.communicationPreferences.filter((p) => p !== preference)
        : [...prev.communicationPreferences, preference],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.diagnosis) {
      setError("Please select a diagnosis");
      setIsLoading(false);
      return;
    }

    if (formData.diagnosis === "Other" && !formData.customDiagnosis.trim()) {
      setError("Please specify your diagnosis");
      setIsLoading(false);
      return;
    }

    if (
      !formData.trustedContact.name.trim() ||
      !formData.trustedContact.phone.trim()
    ) {
      setError("Trusted contact name and phone number are required");
      setIsLoading(false);
      return;
    }

    if (!formData.profilePasscode.trim()) {
      setError("Profile passcode is required");
      setIsLoading(false);
      return;
    }

    try {
      const token = auth.getToken();
      const response = await fetch("/api/passport/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          `Communication Passport ${
            isEditing ? "updated" : "created"
          } successfully!`
        );
        setIsEditing(true);
      } else {
        setError(data.message || "Failed to save Communication Passport");
      }
    } catch (err) {
      console.error("Error saving passport:", err);
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="create-passport-container py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="passport-card">
            <Card.Body className="p-4">
              <h2 className="passport-title text-center mb-4">
                {isEditing ? "Update" : "Create"} Your Communication Passport
              </h2>

              <p className="text-muted text-center mb-4">
                This information will help others understand how to communicate
                with you effectively.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Name Fields */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Preferred Name (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                    placeholder="What would you like to be called? (e.g., nickname, chosen name)"
                  />
                  <Form.Text className="text-muted">
                    If provided, this is how others will address you
                  </Form.Text>
                </Form.Group>

                {/* Diagnosis Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Diagnosis *</Form.Label>
                  <Form.Select
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your diagnosis</option>
                    {diagnosisOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Custom Diagnosis Field */}
                {formData.diagnosis === "Other" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Please specify your diagnosis *</Form.Label>
                    <Form.Control
                      type="text"
                      name="customDiagnosis"
                      value={formData.customDiagnosis}
                      onChange={handleInputChange}
                      placeholder="Enter your specific diagnosis"
                      required
                    />
                  </Form.Group>
                )}

                {/* Communication Preferences */}
                <Form.Group className="mb-3">
                  <Form.Label>Communication Preferences</Form.Label>
                  <div className="preferences-container">
                    {preferenceOptions.map((preference) => (
                      <div key={preference} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id={`pref-${preference}`}
                          label={preference}
                          checked={formData.communicationPreferences.includes(
                            preference
                          )}
                          onChange={() => handlePreferenceChange(preference)}
                        />
                      </div>
                    ))}
                  </div>
                </Form.Group>

                {/* Avoid Words Field */}
                {formData.communicationPreferences.includes(
                  "Avoid specific words/phrases/topics"
                ) && (
                  <Form.Group className="mb-3">
                    <Form.Label>Words/Phrases/Topics to Avoid</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="avoidWords"
                      value={formData.avoidWords}
                      onChange={handleInputChange}
                      placeholder="List specific words, phrases, or topics to avoid..."
                    />
                  </Form.Group>
                )}

                {/* Custom Preferences Field */}
                {formData.communicationPreferences.includes("Other") && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Additional Communication Preferences
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="customPreferences"
                      value={formData.customPreferences}
                      onChange={handleInputChange}
                      placeholder="Describe any other communication accommodations you need..."
                    />
                  </Form.Group>
                )}

                {/* Trusted Contact Section */}
                <Card className="mb-4 bg-light">
                  <Card.Body>
                    <h5 className="mb-3">Trusted Contact Information</h5>
                    <p className="small text-muted mb-3">
                      <strong>Important:</strong> Please consult with this
                      person before adding them as your trusted contact so they
                      are prepared to provide support if needed.
                    </p>

                    <Form.Group className="mb-3">
                      <Form.Label>Contact Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="trustedContact.name"
                        value={formData.trustedContact.name}
                        onChange={handleInputChange}
                        placeholder="Enter trusted contact's name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="trustedContact.phone"
                        value={formData.trustedContact.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-0">
                      <Form.Label>Email Address (Optional)</Form.Label>
                      <Form.Control
                        type="email"
                        name="trustedContact.email"
                        value={formData.trustedContact.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Profile Passcode */}
                <Form.Group className="mb-3">
                  <Form.Label>Profile Passcode *</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      name="profilePasscode"
                      value={formData.profilePasscode}
                      onChange={handleInputChange}
                      placeholder="Create your own passcode (e.g., MyName123)"
                      required
                      className="text-uppercase"
                    />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={generatePasscode}
                      className="passcode-generate-btn"
                      title="Generate a random passcode"
                    >
                      Generate
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    <strong>Create your own memorable passcode</strong> or use
                    the Generate button. This code allows others to access your
                    Communication Passport (6-20 letters/numbers only).
                  </Form.Text>
                </Form.Group>

                {/* Other Information */}
                <Form.Group className="mb-4">
                  <Form.Label>Additional Information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="otherInformation"
                    value={formData.otherInformation}
                    onChange={handleInputChange}
                    placeholder="Any other important information you'd like to share..."
                    maxLength={1000}
                  />
                  <Form.Text className="text-muted">
                    {formData.otherInformation.length}/1000 characters
                  </Form.Text>
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 passport-submit-btn"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Passport"
                    : "Create Passport"}
                </Button>
              </Form>

              {/* Action buttons */}
              <div className="text-center mt-3">
                {isEditing ? (
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() =>
                        navigate(`/passport/view/${formData.profilePasscode}`)
                      }
                    >
                      View My Passport
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => setShowQRModal(true)}
                      title="Generate QR code for easy sharing"
                    >
                      <i className="fas fa-qrcode me-1"></i>
                      Get QR Code
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* QR Code Generator Modal */}
          {isEditing && (
            <QRCodeGenerator
              show={showQRModal}
              onHide={() => setShowQRModal(false)}
              passcode={formData.profilePasscode}
              passportName={formData.preferredName || formData.firstName}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePassport;
