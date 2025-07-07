import React from "react";
import { Card, Row, Col, Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth.js";

// Educational content about autism
export const AutismContent = () => {
  // Check if user is logged in
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
  <Accordion.Item eventKey="0">
    <Accordion.Header>Understanding Autism: A Quick Guide</Accordion.Header>
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
};

// Educational content about ADHD
export const ADHDContent = () => {
  // Check if user is logged in
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
  <Accordion.Item eventKey="1">
    <Accordion.Header>Understanding ADHD: A Quick Guide</Accordion.Header>
    <Accordion.Body>
      <h5>What is ADHD?</h5>
      <p>
        ADHD (Attention-Deficit/Hyperactivity Disorder) is a neurodevelopmental
        condition that affects how a person focuses, regulates impulses, and manages
        energy levels. ADHD is not a behaviour problem, a lack of discipline, or something
        that people "grow out of."
      </p>
      <p>
        ADHD exists across all ages and backgrounds. It presents differently in everyone
        and often looks different in children compared to adults, or between genders.
      </p>

      <h5>Common Characteristics of ADHD</h5>
      <p>
        Just as people are unique, so is everyone's experience of living with ADHD. People
        with ADHD may experience some or all of the following:
      </p>
      <ul className="feature-list-simple">
        <li>Inattention: difficulty staying focused, forgetfulness, being easily distracted</li>
        <li>Hyperactivity: feeling restless, fidgeting, needing to move or talk often</li>
        <li>Impulsivity: acting without thinking, interrupting, difficulty with self-control</li>
        <li>Time blindness: losing track of time or struggling with deadlines</li>
        <li>Emotional regulation: intense emotions, mood swings, or frustration</li>
        <li>Executive dysfunction: challenges with organising, planning, or following multi-step tasks</li>
      </ul>
      <p>
        ADHD is not a lack of intelligence or ability. Many people with ADHD are incredibly
        creative, intuitive, and driven—they just think and work differently.
      </p>

      <h5>Quick Facts</h5>
      <ul className="feature-list-simple">
        <li>ADHD affects around 5-10% of people worldwide.</li>
        <li>It can co-occur with anxiety, autism, learning disabilities, and more.</li>
        <li>Girls and women are often underdiagnosed due to less visible hyperactivity.</li>
        <li>Many adults with ADHD were never diagnosed in childhood.</li>
      </ul>

      <h5>How to Support Someone with ADHD</h5>
      <h6>Listen & Validate</h6>
      <ul className="feature-list-simple">
        <li>Believe their experiences. ADHD is real.</li>
        <li>Avoid labelling behaviours as "lazy" or "careless."</li>
        <li>Understand that ADHD impacts consistency, not intent.</li>
      </ul>

      <h6>Offer Structure, Not Control</h6>
      <ul className="feature-list-simple">
        <li>Use clear, concise instructions.</li>
        <li>Break tasks into smaller steps.</li>
        <li>Offer reminders or visual supports (e.g., checklists, timers).</li>
      </ul>

      <h6>Be Patient with Time & Focus</h6>
      <ul className="feature-list-simple">
        <li>Understand that time management can be genuinely difficult.</li>
        <li>Allow extra time for transitions or completion of tasks.</li>
        <li>Create quiet, distraction-free environments when possible.</li>
      </ul>

      <h6>Embrace Flexibility</h6>
      <ul className="feature-list-simple">
        <li>Avoid rigid systems—what works one day might not the next.</li>
        <li>Let people use tools that help (fidget toys, standing desks, noise-cancelling headphones, etc.).</li>
      </ul>

      <h6>Support Emotional Needs</h6>
      <ul className="feature-list-simple">
        <li>ADHD can come with frustration, shame, or self-doubt from years of being misunderstood.</li>
        <li>Celebrate strengths and progress, not just outcomes.</li>
        <li>Encourage rest and regulate expectations—burnout is real.</li>
      </ul>

      <h5>What ADHD Might Sound Like</h5>
      <blockquote className="blockquote">
        <p>"I really want to do this, I just can't get started."</p>
        <p>"I meant to reply—I just forgot, not because I don't care."</p>
        <p>"My brain's going too fast. I can't slow it down."</p>
        <p>"I hyperfocused and didn't realize hours had passed."</p>
        <p>"I keep trying, but I always feel like I'm falling behind."</p>
      </blockquote>
      <p>
        Understanding these experiences helps build empathy, reduce stigma, and create
        truly inclusive spaces.
      </p>

      <h5>Using Get2KnowMe with ADHD</h5>
      <p>Many ADHD users find a Communication Passport especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Explaining executive functioning challenges</li>
        <li>Highlighting sensory needs or distractions</li>
        <li>Requesting workplace or classroom adjustments</li>
        <li>Advocating for tools like planners, breaks, or movement options</li>
        <li>Sharing their communication style and strengths with others</li>
      </ul>

      <h5>Support Services</h5>
      <ul className="feature-list-simple">
        <li><a href="https://www.adhdfoundation.org.uk" target="_blank" rel="noopener noreferrer">ADHD Foundation</a></li>
        <li><a href="https://www.adhdadult.uk" target="_blank" rel="noopener noreferrer">ADHD Adult</a></li>
      </ul>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <i className="fas fa-id-card me-2"></i>
          Start creating your ADHD-friendly passport
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
  );
};

// Educational content about ADHD
export const DyslexiaContent = () => {
  // Check if user is logged in
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
  <Accordion.Item eventKey="1">
    <Accordion.Header>Understanding Dyslexia: A Quick Guide</Accordion.Header>
    <Accordion.Body>
      <h5>What is ADHD?</h5>
      <p>
        ADHD (Attention-Deficit/Hyperactivity Disorder) is a neurodevelopmental
        condition that affects how a person focuses, regulates impulses, and manages
        energy levels. ADHD is not a behaviour problem, a lack of discipline, or something
        that people "grow out of."
      </p>
      <p>
        ADHD exists across all ages and backgrounds. It presents differently in everyone
        and often looks different in children compared to adults, or between genders.
      </p>

      <h5>Common Characteristics of ADHD</h5>
      <p>
        Just as people are unique, so is everyone's experience of living with ADHD. People
        with ADHD may experience some or all of the following:
      </p>
      <ul className="feature-list-simple">
        <li>Inattention: difficulty staying focused, forgetfulness, being easily distracted</li>
        <li>Hyperactivity: feeling restless, fidgeting, needing to move or talk often</li>
        <li>Impulsivity: acting without thinking, interrupting, difficulty with self-control</li>
        <li>Time blindness: losing track of time or struggling with deadlines</li>
        <li>Emotional regulation: intense emotions, mood swings, or frustration</li>
        <li>Executive dysfunction: challenges with organising, planning, or following multi-step tasks</li>
      </ul>
      <p>
        ADHD is not a lack of intelligence or ability. Many people with ADHD are incredibly
        creative, intuitive, and driven—they just think and work differently.
      </p>

      <h5>Quick Facts</h5>
      <ul className="feature-list-simple">
        <li>ADHD affects around 5-10% of people worldwide.</li>
        <li>It can co-occur with anxiety, autism, learning disabilities, and more.</li>
        <li>Girls and women are often underdiagnosed due to less visible hyperactivity.</li>
        <li>Many adults with ADHD were never diagnosed in childhood.</li>
      </ul>

      <h5>How to Support Someone with ADHD</h5>
      <h6>Listen & Validate</h6>
      <ul className="feature-list-simple">
        <li>Believe their experiences. ADHD is real.</li>
        <li>Avoid labelling behaviours as "lazy" or "careless."</li>
        <li>Understand that ADHD impacts consistency, not intent.</li>
      </ul>

      <h6>Offer Structure, Not Control</h6>
      <ul className="feature-list-simple">
        <li>Use clear, concise instructions.</li>
        <li>Break tasks into smaller steps.</li>
        <li>Offer reminders or visual supports (e.g., checklists, timers).</li>
      </ul>

      <h6>Be Patient with Time & Focus</h6>
      <ul className="feature-list-simple">
        <li>Understand that time management can be genuinely difficult.</li>
        <li>Allow extra time for transitions or completion of tasks.</li>
        <li>Create quiet, distraction-free environments when possible.</li>
      </ul>

      <h6>Embrace Flexibility</h6>
      <ul className="feature-list-simple">
        <li>Avoid rigid systems—what works one day might not the next.</li>
        <li>Let people use tools that help (fidget toys, standing desks, noise-cancelling headphones, etc.).</li>
      </ul>

      <h6>Support Emotional Needs</h6>
      <ul className="feature-list-simple">
        <li>ADHD can come with frustration, shame, or self-doubt from years of being misunderstood.</li>
        <li>Celebrate strengths and progress, not just outcomes.</li>
        <li>Encourage rest and regulate expectations—burnout is real.</li>
      </ul>

      <h5>What ADHD Might Sound Like</h5>
      <blockquote className="blockquote">
        <p>"I really want to do this, I just can't get started."</p>
        <p>"I meant to reply—I just forgot, not because I don't care."</p>
        <p>"My brain's going too fast. I can't slow it down."</p>
        <p>"I hyperfocused and didn't realize hours had passed."</p>
        <p>"I keep trying, but I always feel like I'm falling behind."</p>
      </blockquote>
      <p>
        Understanding these experiences helps build empathy, reduce stigma, and create
        truly inclusive spaces.
      </p>

      <h5>Using Get2KnowMe with ADHD</h5>
      <p>Many ADHD users find a Communication Passport especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Explaining executive functioning challenges</li>
        <li>Highlighting sensory needs or distractions</li>
        <li>Requesting workplace or classroom adjustments</li>
        <li>Advocating for tools like planners, breaks, or movement options</li>
        <li>Sharing their communication style and strengths with others</li>
      </ul>

      <h5>Support Services</h5>
      <ul className="feature-list-simple">
        <li><a href="https://www.adhdfoundation.org.uk" target="_blank" rel="noopener noreferrer">ADHD Foundation</a></li>
        <li><a href="https://www.adhdadult.uk" target="_blank" rel="noopener noreferrer">ADHD Adult</a></li>
      </ul>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <i className="fas fa-id-card me-2"></i>
          Start creating your ADHD-friendly passport
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
  );
};


// Main educational sections component - now focused on autism and ADHD only
export const DiagnosisEducationSection = () => (
  <Card className="home-card mb-4">
    <Card.Body className="p-5">
      <Accordion>
        <AutismContent />
        <ADHDContent />
      </Accordion>
    </Card.Body>
  </Card>
);

