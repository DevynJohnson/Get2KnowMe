import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CPTSDContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="5">
    <Accordion.Header>Complex Post-Traumatic Stress Disorder (C-PTSD)</Accordion.Header>
    <Accordion.Body>
      <h5>What is C-PTSD?</h5>
      <p>
        C-PTSD (Complex Post-Traumatic Stress Disorder) is a trauma-related mental health condition that arises from long-term, repeated trauma, particularly trauma that occurs in childhood, relationships, or environments where escape or safety is limited.
      </p>
      <p>
        Unlike PTSD, which can be triggered by a single event, C-PTSD develops from prolonged exposure to trauma, such as abuse, neglect, exploitation, captivity, or systemic oppression.
      </p>
      <h5>Common Traits of C-PTSD</h5>
      <p>People with C-PTSD may experience:</p>
      <ul className="feature-list-simple">
        <li>Flashbacks, intrusive memories, or nightmares</li>
        <li>Chronic feelings of shame, guilt, or worthlessness</li>
        <li>Difficulty trusting others or forming healthy relationships</li>
        <li>Fear of abandonment or rejection</li>
        <li>Emotional numbness or emotional overwhelm</li>
        <li>Difficulty regulating emotions (anger, sadness, anxiety)</li>
        <li>Dissociation or “shutting down” under stress</li>
        <li>Persistent inner criticism or self-blame</li>
      </ul>
      <p>C-PTSD is not “just being sensitive.” It’s a real and complex nervous system response to long-term harm.</p>
      <h5>C-PTSD Is...</h5>
      <ul className="feature-list-simple">
        <li>A recognised and serious trauma response</li>
        <li>Often linked to early developmental trauma or prolonged abuse</li>
        <li>More than just PTSD + anxiety—it has its own symptoms and impacts</li>
        <li>Valid, even if the trauma isn’t visible or “obvious” to others</li>
      </ul>
      <h5>How to Support Someone with C-PTSD</h5>
      <h6>Create Safety First</h6>
      <ul className="feature-list-simple">
        <li>Be consistent, respectful, and non-judgmental</li>
        <li>Avoid shouting, unpredictability, or forced confrontation</li>
        <li>Respect their boundaries without pressure</li>
      </ul>
      <h6>Use Trauma-Informed Communication</h6>
      <ul className="feature-list-simple">
        <li>Ask before giving physical contact or strong emotional feedback</li>
        <li>Offer choices rather than ultimatums</li>
        <li>Be calm and patient if someone becomes withdrawn or reactive</li>
      </ul>
      <h6>Help Regulate, Don’t Escalate</h6>
      <ul className="feature-list-simple">
        <li>Encourage grounding techniques (breathing, movement, sensory items)</li>
        <li>Avoid “why” questions that sound blaming (e.g. “Why are you overreacting?”)</li>
        <li>Recognise that emotional flashbacks can feel very real, even if they’re from the past</li>
      </ul>
      <h6>Be Compassionate, Not Controlling</h6>
      <ul className="feature-list-simple">
        <li>Don’t try to “fix” someone—validate their experience</li>
        <li>Celebrate their resilience, not just their progress</li>
        <li>Understand that healing is nonlinear and deeply personal</li>
      </ul>
      <h5>What C-PTSD Might Sound Like:</h5>
      <blockquote className="blockquote">
        <p>“I don’t always feel safe, even when I know I am.”</p>
        <p>“It’s hard to trust people, even if they’re kind.”</p>
        <p>“Sometimes I go numb—it’s how I survive.”</p>
        <p>“I’m not trying to be dramatic—I’ve been through a lot.”</p>
        <p>“Please don’t rush me. I need time and patience.”</p>
      </blockquote>
      <h5>Using Get2KnowMe with C-PTSD</h5>
      <p>Many users with C-PTSD find a Get2KnowMe plan especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Setting clear emotional and sensory boundaries</li>
        <li>Explaining reactions that may otherwise be misunderstood</li>
        <li>Asking for grounding strategies, safe language, or trauma-aware care</li>
        <li>Avoiding triggers in clinical, educational, or workplace settings</li>
      </ul>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <i className="fas fa-id-card me-2"></i>
          Start creating your C-PTSD friendly plan
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
);

export default CPTSDContent;
