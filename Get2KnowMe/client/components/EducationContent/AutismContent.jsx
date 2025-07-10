import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AutismContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="0">
    <Accordion.Header>Autism Spectrum Disorder (ASD)</Accordion.Header>
    <Accordion.Body>
      <h5>What is Autism?</h5>
      <p>
        Also known as Autism Spectrum Disorder (ASD) is a lifelong neurodevelopmental
        difference that affects how a person experiences the world, processes information,
        and interacts with others.
      </p>
      <p>
        Autism is not a disease or something that needs to be "fixed." It's a different way of
        thinking, feeling, and being, often accompanied by unique strengths as well as
        challenges.
      </p>
      <h5>Common Traits of Autism</h5>
      <p>
        Autism is described as a spectrum because the characteristics and support needs of
        individuals with autism vary widely, ranging from requiring little to no support to
        others requiring daily support. Autism is a spectrum and not a scale. People don't fit
        into "mild" or "severe" categories—they have different profiles of support needs and
        traits.
      </p>
      <p>Each autistic person is unique, but common traits may include:</p>
      <ul className="feature-list-simple">
        <li>Differences in communication (verbal, nonverbal, or alternative methods)</li>
        <li>Preference for routine or predictability</li>
        <li>Sensory sensitivities (to sound, light, touch, etc.)</li>
        <li>Intense interests or deep focus on specific topics</li>
        <li>Differences in social interaction or understanding social cues</li>
        <li>Repetitive movements or self-regulating behaviours – commonly referred to as stimming</li>
      </ul>
      <h5>Autism Is...</h5>
      <ul className="feature-list-simple">
        <li>A natural part of human diversity</li>
        <li>Present from birth (even if diagnosed later)</li>
        <li>Often misunderstood</li>
        <li>Different in every individual</li>
      </ul>
      <h5>How to Support Someone with Autism</h5>
      <h6>Respect Communication Differences</h6>
      <ul className="feature-list-simple">
        <li>Don't force eye contact or spoken answers</li>
        <li>Allow time to process and respond</li>
        <li>Accept nonverbal or alternative communication (Environmental prompts, gestures, AAC, communication systems including PECS)</li>
      </ul>
      <h6>Be Predictable & Clear</h6>
      <ul className="feature-list-simple">
        <li>Use simple, direct language</li>
        <li>Offer warnings before changes or transitions</li>
        <li>Use visual supports like schedules or symbols</li>
      </ul>
      <h6>Understand Sensory Needs</h6>
      <ul className="feature-list-simple">
        <li>Respect when someone uses headphones, sunglasses, or stims</li>
        <li>Ask before touching—some people dislike physical contact</li>
        <li>Avoid crowded or noisy environments when possible</li>
        <li>Visit environments which are enjoyable (sensory rooms, etc.)</li>
      </ul>
      <h6>Respect Their Identity</h6>
      <ul className="feature-list-simple">
        <li>Listen to how someone describes themselves</li>
        <li>Don't speak over autistic voices</li>
        <li>Support autistic joy, not just coping</li>
      </ul>
      <h5>What Autism Might Sound Like:</h5>
      <blockquote className="blockquote">
        <p>"I'm not being rude—I just need quiet to think."</p>
        <p>"My special interest helps me feel safe and focused."</p>
        <p>"I stim because it calms me."</p>
        <p>"Small talk is confusing. I prefer deep conversations or none at all."</p>
        <p>"Routine helps me manage an overwhelming world."</p>
      </blockquote>
      <h5>Autism & Get2KnowMe</h5>
      <p>Many Autism (ASD) users find a Communication Passport especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Share preferred ways to communicate</li>
        <li>Explain sensory needs, routines, or stimming behaviours</li>
        <li>Outline helpful accommodations in schools, workplaces, or public settings</li>
        <li>Reduce anxiety around new people or environments</li>
      </ul>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <i className="fas fa-id-card me-2"></i>
          Create your personalised autism-friendly passport!
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
);

export default AutismContent;
