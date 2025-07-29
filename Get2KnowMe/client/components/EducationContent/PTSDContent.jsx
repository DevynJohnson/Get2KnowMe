import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PTSDContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="4">
    <Accordion.Header>Post-Traumatic Stress Disorder (PTSD)</Accordion.Header>
    <Accordion.Body>
      <h5>What is PTSD?</h5>
      <p>
        Post-Traumatic Stress Disorder (PTSD) is a mental health condition that can develop after experiencing or witnessing a terrifying or life-threatening event. This might include accidents, assault, natural disasters, war, medical trauma, or the sudden loss of a loved one.
      </p>
      <p>
        PTSD is the brain’s way of trying to protect itself after trauma—but it can cause ongoing distress and make it hard to feel safe, even in safe environments.
      </p>
      <h5>Common Traits of PTSD</h5>
      <p>People with PTSD may experience:</p>
      <ul className="feature-list-simple">
        <li>Flashbacks, nightmares, or intrusive thoughts</li>
        <li>Heightened anxiety or hypervigilance</li>
        <li>Avoidance of reminders of the trauma (places, people, sounds)</li>
        <li>Emotional numbness or detachment</li>
        <li>Irritability or sudden outbursts</li>
        <li>Startle response to loud noises or surprises</li>
        <li>Memory problems, especially around the traumatic event</li>
        <li>Difficulty sleeping or concentrating</li>
      </ul>
      <p>PTSD is not a weakness—it is a survival response to overwhelming experiences.</p>
      <h5>PTSD Is...</h5>
      <ul className="feature-list-simple">
        <li>A recognized mental health condition—not just “being upset”</li>
        <li>Caused by trauma, not personality</li>
        <li>Experienced differently by everyone</li>
        <li>Treatable with time, support, and the right resources</li>
      </ul>
      <h5>How to Support Someone with PTSD</h5>
      <h6>Be Trauma-Informed</h6>
      <ul className="feature-list-simple">
        <li>Avoid assumptions about what someone “should” be over by now</li>
        <li>Respect personal boundaries and space</li>
        <li>Don’t push for details about their trauma—they’ll share if/when ready</li>
      </ul>
      <h6>Provide Emotional Safety</h6>
      <ul className="feature-list-simple">
        <li>Be predictable, calm, and consistent</li>
        <li>Let them know they’re safe (without pressure)</li>
        <li>Avoid shouting, sudden touch, or triggering language</li>
      </ul>
      <h6>Be Flexible and Patient</h6>
      <ul className="feature-list-simple">
        <li>Understand that everyday situations may feel dangerous to them</li>
        <li>Offer grounding options (quiet spaces, sensory tools, breaks)</li>
        <li>Avoid time pressure or high-stimulation environments when possible</li>
      </ul>
      <h6>Encourage Autonomy</h6>
      <ul className="feature-list-simple">
        <li>Ask, “What helps you feel safe right now?”</li>
        <li>Give choices and control wherever possible</li>
        <li>Believe them if they say they’re struggling—even if you can’t see it</li>
      </ul>
      <h5>What PTSD Might Sound Like:</h5>
      <blockquote className="blockquote">
        <p>“I feel like I’m reliving it—even if I know I’m safe.”</p>
        <p>“Loud sounds or crowds put me on edge.”</p>
        <p>“Sometimes I need to step away—I’m not being rude.”</p>
        <p>“I avoid certain situations to keep my anxiety down.”</p>
        <p>“Please don’t touch me without warning.”</p>
        <p>“I’m doing my best—even if it doesn’t show.”</p>
      </blockquote>
      <h5>Using Get2KnowMe with PTSD</h5>
      <p>Many users with PTSD find a Get2KnowMe plan especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Communicating boundaries and triggers in advance</li>
        <li>Sharing preferred support strategies (e.g., space, quiet, grounding tools)</li>
        <li>Avoiding repeating their trauma story in every new environment</li>
        <li>Being met with understanding, not judgment</li>
      </ul>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <i className="fas fa-id-card me-2"></i>
          Start creating your PTSD-friendly passport
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
);

export default PTSDContent;
