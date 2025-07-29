import React from "react";
import { Card, Accordion } from "react-bootstrap";
import AutismContent from "./AutismContent";
import ADHDContent from "./ADHDContent";
import DyslexiaContent from "./DyslexiaContent";
import DyscalculiaContent from "./DyscalculiaContent";
import PTSDContent from "./PTSDContent";
import CPTSDContent from "./C-PTSDContent";

export const DiagnosisEducationSection = ({ isLoggedIn }) => (
  <Card className="home-card mb-4">
    <Card.Body className="p-5">
      <h1 className="mb-2 text-center">Quick Guides</h1>
      <h2 className="mb-4 text-center" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
        Understanding Neurodivergent and Mental Health Diagnoses
      </h2>
      <p className="mb-4 text-center">Click on the sections below to learn more:</p>
      <Accordion>
        <AutismContent isLoggedIn={isLoggedIn} />
        <ADHDContent isLoggedIn={isLoggedIn} />
        <DyslexiaContent isLoggedIn={isLoggedIn} />
        <DyscalculiaContent isLoggedIn={isLoggedIn} />
        <PTSDContent isLoggedIn={isLoggedIn} />
        <CPTSDContent isLoggedIn={isLoggedIn} />
      </Accordion>
    </Card.Body>
  </Card>
);
