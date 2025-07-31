import React from "react";
import { Container, Card } from "react-bootstrap";

const ConsentThankYou = () => (
  <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <Card className="p-4 shadow-lg" style={{ maxWidth: 500, width: "100%" }}>
      <Card.Body>
        <h2 className="text-center mb-4">Thank You for Your Consent</h2>
        <p className="text-center mb-3">
          We appreciate you taking the time to review and provide your consent for your child or dependent to use Get2KnowMe.
        </p>
        <p className="text-center mb-3">
          Their account has now been created and they can begin using Get2KnowMe to build their Communication Passport.
        </p>
        <p className="text-center mb-0">
          If you have any questions or concerns, please contact us at <a href="mailto:enquiries@get2knowme.co.uk">enquiries@get2knowme.co.uk</a>.
        </p>
      </Card.Body>
    </Card>
  </Container>
);

export default ConsentThankYou;
