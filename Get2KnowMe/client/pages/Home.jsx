import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthService from "../utils/auth.js";
import "../styles/Home.css";

const Home = () => {
  // Check if user is logged in
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch {
    user = null;
  }

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Hero Section */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5 text-center">
              {/* <h1 className="display-4 home-title mb-4">
                Welcome to Get2KnowMe
              </h1> */}
              <img src="/get2knowme_logo_png.png" alt="Get2KnowMe Logo" className="home-logo mb-4" />
              <p className="lead mb-4">
                Empowering neurodivergent individuals through digital
                Communication Passports
              </p>
              <h2 className="h3 mb-4">What is Get2KnowMe?</h2>
              <p className="mb-4">
                Get2KnowMe is made for being understood and its purpose is to
                help people be seen for who they are - not just their diagnosis.
              </p>
              <p className="mb-4">
                Together we can make communication fairer, kinder, and more
                human. Get2KnowMe provides a simple and secure platform that
                helps people communicate their needs, preferences, and
                personality - especially when words are difficult to find.
              </p>
              <p className="mb-4">
                It's designed for neurodivergent individuals, people with
                communication differences, or anybody who wants to be better
                understood.
              </p>
              <p className="mb-4">
                With Get2KnowMe, you can create a Digital Communication
                Passport: a personalized profile that explains how you
                communicate, any adaptations or accommodations you need, and
                what support is helpful for you, as well as the things that make
                you feel safe, seen and heard.
              </p>
              <p className="mb-4">
                Each passport comes with a unique QR code, allowing you to
                easily share your information with teachers, healthcare workers,
                emergency workers, employers, caregivers, friends, or anyone you
                meet.
              </p>
              <h2 className="h3 mb-4">Why It Matters</h2>
                  <p className="mb-4">
                    Having to explain yourself repeatedly can be exhausting,
                    especially in high-stress situations or unfamiliar
                    environments. Get2KnowMe gives you a voice, even in times
                    when it may be hard to speak.
                  </p>
                  <p className="mb-4">
                    Get2KnowMe is about autonomy, dignity, and creating a world
                    where people are met with understanding - not assumptions.
                  </p>

              {user ? (
                <Link to="/profile" className="cta-button">
                  <FontAwesomeIcon icon="user" />
                  Go to My Profile
                </Link>
              ) : (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/register" className="cta-button">
                    <FontAwesomeIcon icon="user-plus" />
                    Get Started
                  </Link>
                  <Link to="/passport-lookup" className="cta-button secondary">
                    <FontAwesomeIcon icon="search" />
                    View a Passport
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* What is a Communication Passport Section */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5">
              <h2 className="h3 mb-4">
                <FontAwesomeIcon icon="question-circle" className="me-2" />
                What is a Communication Passport?
              </h2>
              <p className="mb-4">
                A Communication Passport is a personalized document that
                contains important information about how you communicate best.
                It helps others understand your communication style,
                preferences, and any accommodations you might need.
              </p>

              <Row>
                <Col md={6}>
                                    <h5>
                    <FontAwesomeIcon icon="lightbulb" className="me-2" />
                    What's Included?
                  </h5>
                  <ul className="feature-list-simple">
                    <li>
                      Important health alerts (e.g., epilepsy, diabetes,
                      allergies, etc.)
                    </li>
                    <li>
                      Communication preferences and style (e.g., verbal,
                      non-verbal, assistive technology)
                    </li>
                    <li>
                      Sensory needs and accommodations (e.g., sensitivities to
                      lights, sounds, or touch)
                    </li>
                    <li>
                      Contact information for a trusted person in the event more
                      support is needed or in case of emergencies
                    </li>
                    <li>Triggers and how to avoid them</li>
                    <li>Helpful strategies for interaction</li>
                    <li>Personal interests and strengths</li>
                    <li>
                      Any additional information to help others interact with
                      you respectfully and effectively
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h5>
                    <FontAwesomeIcon icon="users" className="me-2" />
                    Who Can Benefit:
                  </h5>
                  <ul className="feature-list-simple">
                    <li>
                      Neurodivergent individuals (e.g., autistic individuals,
                      those with ADHD)
                    </li>
                    <li>Those with speech or language differences</li>
                    <li>People with intellectual or cognitive disabilities</li>
                    <li>Children, teens or adults</li>
                    <li>
                      Anybody who would like to be better understood or
                      struggles through social interactions
                    </li>
                    <li>Allies, caregivers and support professionals</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Features Section */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5">
              <h2 className="h3 mb-4">
                <FontAwesomeIcon icon="star" className="me-2" />
                Key Features
              </h2>
              <Row>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <FontAwesomeIcon icon="comments" />
                    </div>
                    <h5>Easy Sharing</h5>
                    <p>
                      Generate QR codes to instantly share your passport with
                      others.
                    </p>
                  </div>
                </Col>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <FontAwesomeIcon icon="user-shield" />
                    </div>
                    <h5>Privacy Focused</h5>
                    <p>Control what information you share and with whom.</p>
                  </div>
                </Col>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <FontAwesomeIcon icon="mobile-alt" />
                    </div>
                    <h5>Mobile Friendly</h5>
                    <p>Access your passport anywhere, on any device.</p>
                  </div>
                </Col>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <FontAwesomeIcon icon="heart" />
                    </div>
                    <h5>Be Understood</h5>
                    <p>
                      Help others understand and support your communication
                      needs.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* How It Works Section */}
          <Card className="home-card">
            <Card.Body className="p-5">
              <h2 className="h3 mb-4">
                <FontAwesomeIcon icon="cogs" className="me-2" />
                How It Works
              </h2>
              <Row>
                <Col md={4} className="mb-4">
                  <div className="step-card text-center">
                    <div className="step-number">1</div>
                    <h5>Create Account</h5>
                    <p>
                      Sign up for free and start building your Communication
                      Passport.
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-4">
                  <div className="step-card text-center">
                    <div className="step-number">2</div>
                    <h5>Build Passport</h5>
                    <p>
                      Fill in your communication preferences, needs, and contact
                      information.
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-4">
                  <div className="step-card text-center">
                    <div className="step-number">3</div>
                    <h5>Share & Connect</h5>
                    <p>
                      Generate QR codes or direct links to share with others
                      easily.
                    </p>
                  </div>
                </Col>
              </Row>

              {!user && (
                <div className="text-center mt-4">
                  <p className="mb-3">Ready to get started?</p>
                  <Link to="/register" className="cta-button">
                    <FontAwesomeIcon icon="rocket" />
                    Create Your Passport
                  </Link>
                  <p className="text-muted mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
