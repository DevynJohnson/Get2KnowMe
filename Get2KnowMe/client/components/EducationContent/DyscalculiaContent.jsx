import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DyscalculiaContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="3">
    <Accordion.Header>Dyscalculia</Accordion.Header>
    <Accordion.Body>
      <h5>What is Dyscalculia?</h5>
      <p>
        Dyscalculia is a specific learning difficulty that affects a person’s ability to understand numbers and math concepts. It is sometimes referred to as “math dyslexia,” but it's a distinct condition that impacts numerical reasoning, memory, and sequencing.
      </p>
      <p>
        People with dyscalculia may find even basic arithmetic challenging, but this doesn’t reflect their intelligence or effort. With the right support, they can develop effective strategies and thrive.
      </p>
      <h5>Common Characteristics of Dyscalculia</h5>
      <p>People with dyscalculia may:</p>
      <ul className="feature-list-simple">
        <li>Confuse similar-looking numbers (e.g., 6 and 9)</li>
        <li>Struggle with sequencing steps in calculations</li>
        <li>Have difficulty estimating time, distance, or quantity</li>
        <li>Forget basic math facts (like times tables)</li>
        <li>Struggle with budgeting, telling time, or understanding measurements</li>
        <li>Feel anxious or overwhelmed by math-related tasks</li>
      </ul>
      <p>Dyscalculia is often invisible and misunderstood—but very real.</p>
      <h5>Dyscalculia Is...</h5>
      <ul className="feature-list-simple">
        <li>A brain-based learning difference</li>
        <li>Present from early childhood (but may go undiagnosed)</li>
        <li>Not due to lack of practice or intelligence</li>
        <li>Often co-occurs with dyslexia, ADHD, or dyspraxia</li>
      </ul>
      <h5>How to Support Someone with Dyscalculia</h5>
      <h6>Be Patient with Math & Time Tasks</h6>
      <ul className="feature-list-simple">
        <li>Don’t assume they’re “bad at math” by choice</li>
        <li>Offer calculators, visual aids, or written step-by-step guides</li>
        <li>Avoid putting them on the spot for mental math</li>
      </ul>
      <h6>Reduce Number-Related Anxiety</h6>
      <ul className="feature-list-simple">
        <li>Encourage asking for help without shame</li>
        <li>Acknowledge effort, not just correct answers</li>
        <li>Avoid rushing or time-limited tasks when possible</li>
      </ul>
      <h6>Use Clear, Visual Support</h6>
      <ul className="feature-list-simple">
        <li>Use charts, diagrams, colour-coding, or manipulatives</li>
        <li>Break tasks down into manageable steps</li>
        <li>Explain concepts in practical, real-world terms</li>
      </ul>
      <h6>Give Alternatives Where Possible</h6>
      <ul className="feature-list-simple">
        <li>Allow the use of digital timers, reminders, or budgeting apps</li>
        <li>Let them show understanding in non-numerical ways (e.g., verbally)</li>
      </ul>
      <h5>What Dyscalculia Might Sound Like:</h5>
      <blockquote className="blockquote">
        <p>“I lose track of numbers easily—it’s not that I’m not trying.”</p>
        <p>“Mental math stresses me out.”</p>
        <p>“I get confused by multi-step problems, even simple ones.”</p>
        <p>“Please don’t rush me—I need time to think it through.”</p>
        <p>“I’m good with words or ideas, but numbers overwhelm me.”</p>
      </blockquote>
      <h5>Using Get2KnowMe with Dyscalculia</h5>
      <p>Many users with Dyscalculia find a Communication Passport especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Explaining challenges with numbers and time in everyday life</li>
        <li>Asking for helpful tools without shame</li>
        <li>Requesting extra processing time in classrooms or workplaces</li>
        <li>Reducing repeated explanations about their needs</li>
      </ul>
      <h5>Support Services</h5>
      <div className="text-center mt-3">
        <Button 
          as={Link} 
          to={isLoggedIn ? "/create-passport" : "/register"}
          variant="primary"
          size="lg"
        >
          <FontAwesomeIcon icon="id-card" className="me-2" />
          Start creating your Dyscalculia-friendly passport
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
);

export default DyscalculiaContent;
