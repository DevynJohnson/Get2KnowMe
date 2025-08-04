import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Button
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCodeGenerator from "./QRCodeGenerator.jsx";
import get2knowmeLogo from "/get2knowme_logo_png.png";
import { formatPhoneForDisplay, createPhoneLink } from "../utils/phoneUtils.js";
import "../styles/ViewPassport.css";

const CommunicationPassport = ({
  passport,
  showQRModal,
  setShowQRModal,
  isOwner = false,
  showTrustedContact,
  setShowTrustedContact,
  passcode
}) => {
  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDisplayDiagnosis = () => {
    if (passport.diagnoses && Array.isArray(passport.diagnoses)) {
      const diagnoses = [...passport.diagnoses];
      if (diagnoses.includes("Other") && passport.customDiagnosis) {
        const otherIndex = diagnoses.indexOf("Other");
        diagnoses[otherIndex] = passport.customDiagnosis;
      }
      return diagnoses;
    }
    if (passport.diagnosis === "Other" && passport.customDiagnosis) {
      return [passport.customDiagnosis];
    }
    return passport.diagnosis ? [passport.diagnosis] : [];
  };

  const formatPhoneNumber = (phone) => formatPhoneForDisplay(phone);

  const getDisplayHealthAlerts = () => {
    if (!passport.healthAlert || !Array.isArray(passport.healthAlert)) return [];
    return passport.healthAlert.map((alert) => {
      if (alert === "Other" && passport.customHealthAlert && passport.customHealthAlert.trim() !== "") return { label: "Other", detail: passport.customHealthAlert };
      if (alert === "Allergies" && passport.allergyList && passport.allergyList.trim() !== "") return { label: "Allergies", detail: passport.allergyList };
      return { label: alert };
    });
  };

  const getHealthAlertBadgeColor = (alert) => {
    if (alert === "Epilepsy") return "danger";
    if (alert === "Type 1 Diabetes" || alert === "Type 2 Diabetes") return "warning";
    if (alert.startsWith("Allergies")) return "success";
    if (alert === "Other" || (passport.customHealthAlert && alert === passport.customHealthAlert)) return "purple";
    return "secondary";
  };

  // Local state for trusted contact (if not controlled by parent)
  const [internalShowTrustedContact, setInternalShowTrustedContact] = useState(false);
  const trustedContactVisible = showTrustedContact !== undefined ? showTrustedContact : internalShowTrustedContact;
  const setTrustedContactVisible = setShowTrustedContact || setInternalShowTrustedContact;

  return (
    <Row className="justify-content-center">
      <Col lg={8} xl={6}>
        <Card className="passport-display-card">
          <Card.Header className="passport-header text-center">
            <div className="passport-icon mb-2">
              <img src={get2knowmeLogo} alt="Get2KnowMe Logo" className="get2knowme-logo" />
            </div>
            <h2 className="passport-name">
              {passport.preferredName || passport.firstName} {passport.lastName}
              {passport.preferredPronouns === "Other" && passport.customPronouns && passport.customPronouns.trim() !== "" ? (
                <span> ({passport.customPronouns})</span>
              ) : passport.preferredPronouns && passport.preferredPronouns !== "" && passport.preferredPronouns !== "Other" ? (
                <span> ({passport.preferredPronouns})</span>
              ) : null}
            </h2>
            <Badge bg="primary" className="passport-badge">
              Communication Passport
            </Badge>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Health Alerts Section */}
            {passport.healthAlert && passport.healthAlert.length > 0 && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="notes-medical" className="section-icon text-danger" />
                  <h4 className="section-title">Health Alerts</h4>
                </div>
                <div className="section-content">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {getDisplayHealthAlerts().map((alertObj, idx) => (
                      <Badge
                        key={idx}
                        bg={getHealthAlertBadgeColor(alertObj.label)}
                        className={`health-alert-badge ${getHealthAlertBadgeColor(alertObj.label) === "purple" ? "bg-purple" : ""}`}
                        style={getHealthAlertBadgeColor(alertObj.label) === "purple" ? { backgroundColor: "#a259d9", color: "#fff" } : {}}
                      >
                        {alertObj.label}
                      </Badge>
                    ))}
                  </div>
                  {getDisplayHealthAlerts().map((alertObj, idx) => (
                    alertObj.detail ? (
                      <div key={idx} className={`mt-1 ms-1 ${alertObj.label === 'Allergies' ? 'allergy-list-text' : 'custom-health-alert-text'}`}>
                        {alertObj.label === 'Allergies' ? null : (
                          <FontAwesomeIcon icon="question-circle" className="text-purple me-1" />
                        )}
                        <span className="fw-bold">{alertObj.label}:</span> {alertObj.detail}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Diagnosis Section */}
            <div className="passport-section mb-4">
              <div className="section-header">
                <FontAwesomeIcon icon="stethoscope" className="section-icon" />
                <h4 className="section-title">Diagnosis</h4>
              </div>
              <div className="section-content">
                <div className="diagnosis-badge-list">
                  {getDisplayDiagnosis().map((diagnosis, index) => (
                    <Badge key={index} bg="info" className="diagnosis-badge">
                      {diagnosis}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Communication Preferences Section */}
            {passport.communicationPreferences &&
              passport.communicationPreferences.length > 0 && (
                <div className="passport-section mb-4">
                  <div className="section-header">
                    <FontAwesomeIcon icon="comments" className="section-icon" />
                    <h4 className="section-title">
                      Communication Preferences
                    </h4>
                  </div>
                  <div className="section-content">
                    <ul className="preferences-list">
                      {passport.communicationPreferences.map(
                        (preference, index) => (
                          <li key={index} className="preference-item">
                            <FontAwesomeIcon icon="check-circle" className="preference-icon" />
                            {preference}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

            {/* Words to Avoid Section */}
            {passport.avoidWords && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="exclamation-triangle" className="section-icon text-warning" />
                  <h4 className="section-title">
                    Words/Phrases/Topics to Avoid
                  </h4>
                </div>
                <div className="section-content">
                  <div className="avoid-words-box">{passport.avoidWords}</div>
                </div>
              </div>
            )}

            {/* Custom Preferences Section */}
            {passport.customPreferences && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="plus-circle" className="section-icon" />
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
                  <FontAwesomeIcon icon="user-shield" className="section-icon text-success" />
                  <h4 className="section-title">Trusted Contact</h4>
                </div>
                <div className="section-content">
                  {!trustedContactVisible ? (
                    <div className="privacy-protection">
                      <div className="privacy-message mb-3">
                        <FontAwesomeIcon icon="lock" className="me-2 text-muted" />
                        <span className="text-muted">
                          Contact information is hidden for privacy protection
                        </span>
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => setTrustedContactVisible(true)}
                        className="show-contact-btn btn-secondary"
                      >
                        <FontAwesomeIcon icon="eye" className="me-2" />
                        Show Trusted Person Contact Information
                      </Button>
                    </div>
                  ) : (
                    <div className="trusted-contact-revealed">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="privacy-note">
                          <FontAwesomeIcon icon="shield-alt" className="me-2 text-success" />
                          <small className="text-success">
                            Contact information visible
                          </small>
                        </div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setTrustedContactVisible(false)}
                          className="hide-contact-btn"
                        >
                          <FontAwesomeIcon icon="eye-slash" className="me-1" />
                          Hide
                        </Button>
                      </div>
                      <div className="trusted-contact-card">
                        <div className="contact-info">
                          <div className="contact-name">
                            <FontAwesomeIcon icon="user" className="contact-icon" />
                            <strong>{passport.trustedContact.name}</strong>
                          </div>
                          <div className="contact-phone">
                            <FontAwesomeIcon icon="phone" className="contact-icon" />
                            <a
                              href={createPhoneLink(
                                passport.trustedContact.phone
                              )}
                            >
                              {formatPhoneNumber(
                                passport.trustedContact.phone
                              )}
                            </a>
                          </div>
                          {passport.trustedContact.email && (
                            <div className="contact-email">
                              <FontAwesomeIcon icon="envelope" className="contact-icon" />
                              <a
                                href={`mailto:${passport.trustedContact.email}`}
                              >
                                {passport.trustedContact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Triggers Section */}
            {passport.triggers && passport.triggers.trim() !== "" && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="bolt" className="section-icon text-danger" />
                  <h4 className="section-title">Triggers</h4>
                </div>
                <div className="section-content">
                  <div className="triggers-box">
                    <FontAwesomeIcon icon="exclamation-circle" className="trigger-icon text-danger me-2" />
                    {passport.triggers}
                  </div>
                </div>
              </div>
            )}

            {/* Likes Section */}
            {passport.likes && passport.likes.trim() !== "" && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="thumbs-up" className="section-icon text-success" />
                  <h4 className="section-title">Likes</h4>
                </div>
                <div className="section-content">
                  <div className="likes-box">
                    <FontAwesomeIcon icon="heart" className="like-icon text-success me-2" />
                    {passport.likes}
                  </div>
                </div>
              </div>
            )}

            {/* Dislikes Section */}
            {passport.dislikes && passport.dislikes.trim() !== "" && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="thumbs-down" className="section-icon text-warning" />
                  <h4 className="section-title">Dislikes</h4>
                </div>
                <div className="section-content">
                  <div className="dislikes-box">
                    <FontAwesomeIcon icon="minus-circle" className="dislike-icon text-warning me-2" />
                    {passport.dislikes}
                  </div>
                </div>
              </div>
            )}

            {/* Other Information Section */}
            {passport.otherInformation && (
              <div className="passport-section mb-4">
                <div className="section-header">
                  <FontAwesomeIcon icon="info-circle" className="section-icon" />
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
                  <FontAwesomeIcon icon="clock" />
                  Last updated: {formatDate(passport.updatedAt)}
                </small>
                <div className="d-flex gap-2">
                  {isOwner && (
                    <>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => setShowQRModal(true)}
                        title="Generate QR code for easy sharing"
                        className="btn-secondary"
                      >
                        <FontAwesomeIcon icon="qrcode" className="me-1" />
                        QR Code
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.print()}
                        className="btn-secondary-reverse"
                      >
                        <FontAwesomeIcon icon="print" className="me-1" />
                        Print
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Emergency Notice */}
        <Alert variant="info" className="mt-3 text-center">
          <Alert.Heading className="h6">
            <FontAwesomeIcon icon="info-circle" /> Important Notice
          </Alert.Heading>
          <p className="mb-0 small">
            If additional support is needed, please contact the trusted person
            listed above. In case of an emergency contact your local emergency
            services.
          </p>
        </Alert>

        {/* QR Code Generator Modal (only for owner) */}
        {isOwner && (
          <QRCodeGenerator
            show={showQRModal}
            onHide={() => setShowQRModal(false)}
            passcode={passcode}
            passportName={passport.preferredName || passport.firstName}
          />
        )}
      </Col>
    </Row>
  );
};

export default CommunicationPassport;
