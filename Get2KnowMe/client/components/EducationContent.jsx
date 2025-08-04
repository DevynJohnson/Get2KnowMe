import React from "react";
import { Card, Row, Col, Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AuthService from "../utils/auth.js";
import "../styles/EducationContent.css";

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
            <FontAwesomeIcon icon="id-card" className="me-2" />
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
            <FontAwesomeIcon icon="id-card" className="me-2" />
            Start creating your ADHD-friendly passport
          </Button>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

// Educational content about Dyslexia
export const DyslexiaContent = () => {
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
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
};

// Educational content about Dyscalculia
export const DyscalculiaContent = () => {
  let isLoggedIn = false;
  try {
    const user = AuthService.getProfile();
    isLoggedIn = !!user;
  } catch {
    isLoggedIn = false;
  }

  return (
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
};

// Main educational sections component - now with page headers and simplified accordion titles
export const DiagnosisEducationSection = () => (
  <Card className="home-card mb-4">
    <Card.Body className="p-5">
      <h1 className="mb-2 text-center">Quick Guides</h1>
      <h2 className="mb-4 text-center" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
        Understanding Neurodivergent and Mental Health Diagnoses
      </h2>
      <p className="mb-4 text-center">Click on the sections below to learn more:</p>
      <Accordion>
        <AutismContent />
        <ADHDContent />
        <DyslexiaContent />
        <DyscalculiaContent />
      </Accordion>
    </Card.Body>
  </Card>
);
