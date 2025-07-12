import React from "react";
import { Container, Card } from "react-bootstrap";

const ConsentDeclined = () => (
  <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <Card className="p-4 shadow-lg" style={{ maxWidth: 500, width: "100%" }}>
      <Card.Body>
        <h2 className="text-center mb-4" style={{ color: '#dc3545' }}>Consent Not Provided</h2>
        <p className="text-center mb-3">
          You have chosen not to provide consent for your child or dependent to use Get2KnowMe.
        </p>
        <p className="text-center mb-3">
          Their registration request has been deleted and no information has been stored.
        </p>
        <p className="text-center mb-0">
          If you have questions, please contact us at <a href="mailto:inquiries@get2knowme.co.uk">inquiries@get2knowme.co.uk</a>.
        </p>
      </Card.Body>
    </Card>
  </Container>
);

export default ConsentDeclined;
