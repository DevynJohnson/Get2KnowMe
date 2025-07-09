// client/pages/CreatePassport.jsx
import React, { useState, useEffect, useRef } from "react";
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
import { parsePhoneNumber } from 'libphonenumber-js';
import auth from "../utils/auth.js";
import QRCodeGenerator from "../components/QRCodeGenerator.jsx";
import PhoneNumberInput from "../components/PhoneNumberInput.jsx";
import { validatePhoneNumber } from '../utils/phoneUtils.js';
import "../styles/CreatePassport.css";
import "../styles/PhoneNumberInput.css";


const CreatePassport = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    diagnoses: [],
    customDiagnosis: "",
    healthAlert: [],
    communicationPreferences: [],
    customPreferences: "",
    triggers: "",
    likes: "",
    dislikes: "",
    trustedContact: {
      name: "",
      phone: "",
      countryCode: "",
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

  // Ref for scrolling to alerts
  const alertRef = useRef(null);

  // Diagnosis options
  const diagnosisOptions = [
    "ASD (Autism Spectrum Disorder)",
    "Attention Deficit Hyperactivity Disorder (ADHD)",
    "Obsessive-Compulsive Disorder (OCD)",
    "Dyslexia",
    "Dyscalculia",
    "Tourette's Syndrome",
    "C-PTSD (Complex PTSD)",
    "Anxiety",
    "No Diagnosis",
    "Other",
  ];

  // Health alert options
  const healthAlertOptions = [
    "None",
    "Type 1 Diabetes",
    "Type 2 Diabetes",
    "Epilepsy",
    "Allergies",
    "Other",
  ];

  // Communication preference options
  const preferenceOptions = [
    "I will understand things better if you speak slowly",
    "I may need extra time to process when you are speaking to me, it may take me a moment to respond",
    "Please avoid complicated questions or confusing language",
    "I do not enjoy physical contact, please do not touch me",
    "Please use gestures and non-verbal cues if possible, they help me understand better",
    "Reading can take me some time, please be patient and allow me time to process the information",
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

  const handleDiagnosisChange = (diagnosis) => {
    setFormData((prev) => {
      // If selecting "No Diagnosis", clear all others and only select it
      if (diagnosis === "No Diagnosis") {
        if (prev.diagnoses.includes("No Diagnosis")) {
          // Unchecking "No Diagnosis"
          return { ...prev, diagnoses: [] };
        } else {
          // Checking "No Diagnosis" (remove all others)
          return { ...prev, diagnoses: ["No Diagnosis"] };
        }
      } else {
        // If "No Diagnosis" is already selected, ignore other selections
        if (prev.diagnoses.includes("No Diagnosis")) {
          return prev;
        }
        // Toggle the selected diagnosis
        return {
          ...prev,
          diagnoses: prev.diagnoses.includes(diagnosis)
            ? prev.diagnoses.filter((d) => d !== diagnosis)
            : [...prev.diagnoses, diagnosis],
        };
      }
    });
  };

  // Handle phone number changes
  const handlePhoneChange = (phoneValue) => {
    setFormData((prev) => ({
      ...prev,
      trustedContact: {
        ...prev.trustedContact,
        phone: phoneValue || "",
        // Do NOT clear countryCode here!
      },
    }));
  };

  // Handle country code changes from PhoneNumberInput
 const handleCountryChange = (countryCode) => {
  // fallback logic to parse from number if no countryCode
  if (!countryCode && formData.trustedContact.phone) {
    try {
      const parsed = parsePhoneNumber(formData.trustedContact.phone);
      countryCode = parsed?.country || "GB";
    } catch (err) {
      console.warn("Could not infer country from phone number", err);
      countryCode = "GB";
    }
  }

  setFormData((prev) => ({
    ...prev,
    trustedContact: {
      ...prev.trustedContact,
      countryCode: countryCode.toUpperCase(),
    },
  }));
};

  // Validate phone number
  const validatePhoneNumberField = (phone) => {
    const country = formData.trustedContact.countryCode || undefined;
    if (!phone) return "Phone number is required";
    if (!validatePhoneNumber(phone, country)) {
      return "Please enter a valid phone number";
    }
    return null;
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

    if (!formData.diagnoses || formData.diagnoses.length === 0) {
      setError("Please select at least one diagnosis");
      setIsLoading(false);
      return;
    }

    if (formData.diagnoses.includes("Other") && !formData.customDiagnosis.trim()) {
      setError("Please specify your diagnosis");
      setIsLoading(false);
      return;
    }

    const phoneError = validatePhoneNumberField(formData.trustedContact.phone);
    if (phoneError) {
      setError(phoneError);
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
        // Scroll to alert after a brief delay to ensure it's rendered
        setTimeout(() => scrollToAlert(), 100);
      } else {
        setError(data.message || "Failed to save Communication Passport");
        setTimeout(() => scrollToAlert(), 100);
      }
    } catch (err) {
      console.error("Error saving passport:", err);
      setError("Server error. Please try again.");
      setTimeout(() => scrollToAlert(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scroll to alert area
  const scrollToAlert = () => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
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

              {/* Alert container with ref for scrolling */}
              <div ref={alertRef}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="form-section mb-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>First Name</Form.Label>
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
                        <Form.Label>Last Name</Form.Label>
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
                </div>

                <div className="form-section mb-3">
                  <Form.Group>
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
                </div>

                {/* Health Alerts Field */}
                <div className="form-section mb-3">
                  <Form.Group>
                    <Form.Label>Health Alerts</Form.Label>
                    <Form.Text className="text-muted d-block mb-2">
                      Select any health conditions or alerts you want others to be aware of. You can select multiple if needed.
                    </Form.Text>
                    <div className="preferences-container">
                      {healthAlertOptions.map((option) => (
                        <div key={option} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`healthAlert-${option}`}
                            label={option}
                            checked={formData.healthAlert.includes(option)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                healthAlert: prev.healthAlert.includes(option)
                                  ? prev.healthAlert.filter((a) => a !== option)
                                  : [...prev.healthAlert, option],
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {/* Show input for 'Other' health alert */}
                    {formData.healthAlert.includes("Other") && (
                      <div className="mt-2">
                        <Form.Label>Please specify your health alert</Form.Label>
                        <Form.Control
                          type="text"
                          name="customHealthAlert"
                          value={formData.customHealthAlert || ""}
                          onChange={handleInputChange}
                          placeholder="Enter your specific health alert"
                          required
                        />
                      </div>
                    )}
                    {/* Show input for 'Allergies' */}
                    {formData.healthAlert.includes("Allergies") && (
                      <div className="mt-2">
                        <Form.Label>Please list your allergies</Form.Label>
                        <Form.Control
                          type="text"
                          name="allergyList"
                          value={formData.allergyList || ""}
                          onChange={handleInputChange}
                          placeholder="List your allergies here"
                          required
                        />
                      </div>
                    )}
                  </Form.Group>
                </div>

                {/* Diagnosis Field */}
                <div className="form-section mb-3">
                  <Form.Group>
                    <Form.Label>Diagnoses</Form.Label>
                    <Form.Text className="text-muted d-block mb-2">
                      💡 <strong>Tip:</strong> You can select multiple diagnoses if needed.
                    </Form.Text>
                    <div className="preferences-container">
                      {diagnosisOptions.map((option) => {
                        // If "No Diagnosis" is selected, disable all others
                        const noDiagnosisSelected = formData.diagnoses.includes("No Diagnosis");
                        const isNoDiagnosis = option === "No Diagnosis";
                        const isDisabled = !isNoDiagnosis && noDiagnosisSelected;
                        return (
                          <div key={option} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`diagnosis-${option}`}
                              label={option}
                              checked={formData.diagnoses.includes(option)}
                              onChange={() => handleDiagnosisChange(option)}
                              disabled={isDisabled}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Form.Group>
                </div>

                {/* Custom Diagnosis Field */}
                {formData.diagnoses.includes("Other") && (
                  <div className="form-section mb-3">
                    <Form.Group>
                      <Form.Label>Please specify your diagnosis</Form.Label>
                      <Form.Control
                        type="text"
                        name="customDiagnosis"
                        value={formData.customDiagnosis}
                        onChange={handleInputChange}
                        placeholder="Enter your specific diagnosis"
                        required
                      />
                    </Form.Group>
                  </div>
                )}

                {/* Communication Preferences */}
                <div className="form-section mb-3">
                  <Form.Group>
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
                </div>

                {/* Custom Preferences Field */}
                {formData.communicationPreferences.includes("Other") && (
                  <div className="form-section mb-3">
                    <Form.Group>
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
                  </div>
                )}

                {/* Triggers Field */}
                <div className="form-section mb-3">
                  <Form.Group>
                    <Form.Label>Triggers (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="triggers"
                      value={formData.triggers}
                      onChange={handleInputChange}
                      placeholder="Describe any triggers, situations, or things that may cause distress or discomfort..."
                    />
                    <Form.Text className="text-muted">
                      This information can help others avoid situations that may be difficult for you.
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* Likes Field */}
                <div className="form-section mb-3">
                  <Form.Group>
                    <Form.Label>Likes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="likes"
                      value={formData.likes}
                      onChange={handleInputChange}
                      placeholder="List things you enjoy, topics you like, or activities that make you happy..."
                    />
                  </Form.Group>
                </div>

                {/* Dislikes Field */}
                <div className="form-section mb-3">
                  <Form.Group>
                    <Form.Label>Dislikes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="dislikes"
                      value={formData.dislikes}
                      onChange={handleInputChange}
                      placeholder="List things you dislike, topics to avoid, or activities that make you uncomfortable..."
                    />
                  </Form.Group>
                </div>

                {/* Trusted Contact Section */}
                <div className="form-section mb-4">
                  <h5 className="mb-3">Trusted Contact Information</h5>
                  <p className="small text-muted mb-3">
                    <strong>Important:</strong> Please consult with this
                    person before adding them as your trusted contact so they
                    are prepared to provide support if needed.
                  </p>

                  <Form.Group className="mb-3">
                    <Form.Label>Contact Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="trustedContact.name"
                      value={formData.trustedContact.name}
                      onChange={handleInputChange}
                      placeholder="Enter trusted contact's name"
                      required
                    />
                  </Form.Group>

                  <PhoneNumberInput
                    value={formData.trustedContact.phone}
                    onChange={handlePhoneChange}
                    label="Phone Number"
                    placeholder="Enter phone number"
                    required
                    country={formData.trustedContact.countryCode || "GB"}
                    onCountryChange={handleCountryChange}
                  />

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
                </div>

                {/* Profile Passcode */}
                <div className="form-section mb-3">
                  <Form.Group>
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
                        className="btn-secondary passcode-generate-btn"
                        onClick={generatePasscode}
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
                </div>

                {/* Other Information */}
                <div className="form-section mb-4">
                  <Form.Group>
                    <Form.Label>Additional Information</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="otherInformation"
                      value={formData.otherInformation}
                      onChange={handleInputChange}
                      placeholder="Any other important information you'd like to share..."                      maxLength={1000}
                    />
                    <Form.Text className="text-muted">
                      {(formData.otherInformation || '').length}/1000 characters
                    </Form.Text>
                  </Form.Group>
                </div>

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
                      className="btn-secondary"
                      onClick={() =>
                        navigate(`/passport/view/${formData.profilePasscode}`)
                      }
                    >
                      View My Passport
                    </Button>
                    <Button
                      className="btn-secondary-reverse"
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
