import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DiagnosisEducationSection } from "../components/EducationContent/EducationSection";
import '../styles/LearnMore.css';
import AuthService from "../utils/auth.js";

const LearnMore = () => {
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Page Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 home-title mb-4">
              Learn More About Neurodiversity
            </h1>
            <p className="lead">
              Educational resources to help build understanding and awareness, and ways in which Get2KnowMe can help support neurodivergent individuals.
            </p>
          </div>

          <DiagnosisEducationSection isLoggedIn={isLoggedIn} />
        </Col>
      </Row>
    </Container>
  );
};

export default LearnMore;
