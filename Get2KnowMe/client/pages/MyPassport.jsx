
import React, { useEffect, useState } from "react";
import { Container, Spinner, Card } from "react-bootstrap";
import AuthService from "../utils/auth.js";
import CommunicationPassport from "../components/CommunicationPassport.jsx";
import '../styles/Home.css';

const MyPassport = () => {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPassport = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = AuthService.getToken();
        const res = await fetch("/api/passport/my-passport", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch passport");
        const data = await res.json();
        setPassport(data.passport);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, []);


  if (loading) {
    return (
      <Container className="home-container text-center">
        <Spinner animation="border" />
        <p>Loading your passport...</p>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="home-container text-center">
        <Card className="home-card p-4">
          <h4>Error</h4>
          <p>{error}</p>
        </Card>
      </Container>
    );
  }
  if (!passport) {
    return (
      <Container className="home-container text-center">
        <Card className="home-card p-4">
          <h4>No Passport Found</h4>
          <p>You have not created a Communication Passport yet.</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="home-container py-4">
      <CommunicationPassport
        passport={passport}
        showQRModal={showQRModal}
        setShowQRModal={setShowQRModal}
        isOwner={true}
        passcode={passport.profilePasscode}
      />
    </Container>
  );
};

export default MyPassport;
