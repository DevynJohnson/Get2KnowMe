import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DyslexiaContent = ({ isLoggedIn }) => (
  <Accordion.Item eventKey="2">
    <Accordion.Header>Dyslexia</Accordion.Header>
    <Accordion.Body>
      <h5>What is Dyslexia?</h5>
      <p>
        Dyslexia is a common, lifelong learning difference that primarily affects the skills involved in reading, spelling, and writing. It has nothing to do with intelligence—many people with dyslexia are highly creative, insightful, and capable.
      </p>
      <p>
        Dyslexia is caused by differences in how the brain processes language. It can affect how people decode words, remember sequences, and express written ideas.
      </p>
      <h5>Common Characteristics of Dyslexia</h5>
      <p>People with dyslexia may:</p>
      <ul className="feature-list-simple">
        <li>Mix up letters, especially when reading or writing (e.g., “b” and “d”)</li>
        <li>Read slowly or with great effort, even when they understand the content</li>
        <li>Struggle with spelling, especially irregular words</li>
        <li>Find it hard to express themselves clearly in writing</li>
        <li>Forget instructions, names, or word order</li>
        <li>Feel frustrated or anxious around reading or timed tasks</li>
      </ul>
      <p>Many people with dyslexia are deep thinkers—they just learn differently.</p>
      <h5>Dyslexia Is...</h5>
      <ul className="feature-list-simple">
        <li>Neurological and often runs in families</li>
        <li>Found in people of all intelligence levels</li>
        <li>Often co-occurs with ADHD, dyscalculia, or dyspraxia</li>
        <li>Not a reflection of laziness or lack of effort</li>
      </ul>
      <h5>How to Support Someone with Dyslexia</h5>
      <h6>Make Reading Accessible</h6>
      <ul className="feature-list-simple">
        <li>Use dyslexia-friendly fonts (e.g., sans-serif, larger size)</li>
        <li>Allow use of text-to-speech tools, audiobooks, and visual supports</li>
        <li>Avoid judging reading aloud—some may prefer not to</li>
      </ul>
      <h6>Be Patient with Spelling & Writing</h6>
      <ul className="feature-list-simple">
        <li>Understand that spelling errors may persist despite effort</li>
        <li>Encourage typing or speech-to-text tools</li>
        <li>Focus on content and ideas, not just grammar or neatness</li>
      </ul>
      <h6>Offer Extra Processing Time</h6>
      <ul className="feature-list-simple">
        <li>Give time to read, understand, and respond</li>
        <li>Avoid rushing or putting people on the spot</li>
        <li>Repeat instructions in different ways—visual, spoken, written</li>
      </ul>
      <h6>Focus on Strengths</h6>
      <ul className="feature-list-simple">
        <li>Many dyslexic individuals are great storytellers, designers, or problem-solvers</li>
        <li>Let them shine in areas like creativity, hands-on work, or big-picture thinking</li>
      </ul>
      <h5>What Dyslexia Might Sound Like:</h5>
      <blockquote className="blockquote">
        <p>“I know the word—I just can’t say or spell it right now.”</p>
        <p>“Reading aloud makes me nervous—I read better silently.”</p>
        <p>“I need more time to process what I’ve read.”</p>
        <p>“I learn better when I can hear or see the information.”</p>
        <p>“Please don’t assume I’m not paying attention—I’m trying.”</p>
      </blockquote>
      <h5>Using Get2KnowMe with Dyslexia</h5>
      <p>Many Dyslexic users find a Communication Passport especially helpful for:</p>
      <ul className="feature-list-simple">
        <li>Asking for assistive tools without stigma</li>
        <li>Explaining their processing needs clearly</li>
        <li>Getting understanding from educators, employers, and peers</li>
        <li>Advocating for support—without having to repeat themselves</li>
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
          Start creating your Dyslexia-friendly passport
        </Button>
      </div>
    </Accordion.Body>
  </Accordion.Item>
);

export default DyslexiaContent;
