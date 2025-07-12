import React from "react";
import { Container, Card } from "react-bootstrap";
import "../styles/emailConfirmed.css";

const emailConfirmed = () => (
  <Container className="email-confirmed-container d-flex justify-content-center align-items-center">
    <Card className="email-confirmed-card p-4 shadow-lg">
      <Card.Body>
        <h2 className="email-confirmed-title text-center mb-4">Thank You for Confirming Your Email Address</h2>
        <p className="text-center mb-3">
          Your account has now been created!
        </p>
        <p className="text-center mb-0">
          If you have any questions or concerns, please contact us at <a href="mailto:inquiries@get2knowme.co.uk">inquiries@get2knowme.co.uk</a>.
        </p>
      </Card.Body>
    </Card>
  </Container>
);

export default emailConfirmed;
