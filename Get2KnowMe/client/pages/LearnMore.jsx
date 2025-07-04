import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DiagnosisEducationSection } from "../components/EducationContent.jsx";
import '../styles/Home.css';

const LearnMore = () => {
  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Page Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 home-title mb-4">
              Learn More About Neurodifferences
            </h1>
            <p className="lead">
              Educational resources to help build understanding and awareness, and ways in which Get2KnowMe can help support them
            </p>
          </div>

          {/* Educational Content About Diagnoses */}
          <DiagnosisEducationSection />
        </Col>
      </Row>
    </Container>
  );
};

export default LearnMore;
