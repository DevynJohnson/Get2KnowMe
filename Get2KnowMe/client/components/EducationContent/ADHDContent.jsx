import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ADHDContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="1">
    <Accordion.Header>Attention-Deficit Hyperactivity Disorder (ADHD)</Accordion.Header>
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

export default ADHDContent;
