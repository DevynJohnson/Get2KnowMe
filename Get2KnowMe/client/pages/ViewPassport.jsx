// client/pages/ViewPassport.jsx
import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import CommunicationPassport from "../components/CommunicationPassport.jsx";
import "../styles/ViewPassport.css";

const ViewPassport = () => {
  const { passcode } = useParams();
  const navigate = useNavigate();

  // Ensure page is scrolled to top on load (especially for mobile)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [passcode]);

  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTrustedContact, setShowTrustedContact] = useState(false);

  useEffect(() => {
    if (passcode) {
      fetchPassport(passcode);
    } else {
      setError("No passcode provided");
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
        setError(
          "Communication Passport not found. Please check the passcode and try again."
        );
      } else {
        setError(
          "Unable to load Communication Passport. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error fetching passport:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
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
        <Alert variant="danger" className="text-center mt-4">
          <Alert.Heading>Unable to Load Passport</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="outline-danger"
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Return to Homepage
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!passport) {
    return (
      <Container className="view-passport-container">
        <Alert variant="warning" className="text-center mt-4">
          <Alert.Heading>Passport Not Found</Alert.Heading>
          <p>The requested Communication Passport could not be found.</p>
          <Button
            variant="outline-warning"
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Return to Homepage
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="view-passport-container py-4">
      <CommunicationPassport
        passport={passport}
        showQRModal={showQRModal}
        setShowQRModal={setShowQRModal}
        showTrustedContact={showTrustedContact}
        setShowTrustedContact={setShowTrustedContact}
        isOwner={false}
        passcode={passcode}
      />
    </Container>
  );
}

export default ViewPassport;
