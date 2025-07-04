import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
              <h1 className="display-4 home-title mb-4">
                Welcome to Get2KnowMe
              </h1>
              <p className="lead mb-4">
                Empowering neurodivergent individuals through digital
                Communication Passports
              </p>
              <p className="mb-4">
                Get2KnowMe is made for being understood and its purpose is to
                help people be seen for who they are, not just their diagnosis.
                Together, we can make communication fairer, kinder, and more
                human. Get2KnowMe provides a simple and secure platform that
                helps people communicate their needs, preferences, and
                personality, especially when words are difficult to find. It’s
                designed for neurodivergent individuals, people
                with communication differences, and anyone who wants to be
                better understood by others. With Get2KnowMe, you can create
                a Digital Communication Passport: a personalised profile that
                explains how you communicate, any adaptations you need, what
                support you find helpful, and what makes you feel safe, seen and
                heard. Each passport comes with a unique QR code, allowing you
                to easily share your information with teachers, healthcare
                workers, emergency workers, employers, caregivers, friends, or
                anyone you meet.
              </p>

              {user ? (
                <Link to="/profile" className="cta-button">
                  <i className="fas fa-user"></i>
                  Go to My Profile
                </Link>
              ) : (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/register" className="cta-button">
                    <i className="fas fa-user-plus"></i>
                    Get Started
                  </Link>
                  <Link to="/passport-lookup" className="cta-button secondary">
                    <i className="fas fa-search"></i>
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
                <i className="fas fa-question-circle me-2"></i>
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
                    <i className="fas fa-lightbulb me-2"></i>
                    What's Included:
                  </h5>
                  <ul className="feature-list-simple">
                    <li>Communication preferences and style</li>
                    <li>Sensory needs and accommodations</li>
                    <li>Emergency contact information</li>
                    <li>Helpful strategies for interaction</li>
                    <li>Personal interests and strengths</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h5>
                    <i className="fas fa-users me-2"></i>
                    Who Can Benefit:
                  </h5>
                  <ul className="feature-list-simple">
                    <li>Autistic individuals</li>
                    <li>People with ADHD</li>
                    <li>Those with learning differences</li>
                    <li>Anyone who wants to communicate their needs</li>
                    <li>Caregivers and support persons</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Features Section */}
          <Card className="home-card mb-4">
            <Card.Body className="p-5">
              <h2 className="h3 mb-4">
                <i className="fas fa-star me-2"></i>
                Key Features
              </h2>
              <Row>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <i className="fas fa-comments"></i>
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
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <h5>Privacy Focused</h5>
                    <p>Control what information you share and with whom.</p>
                  </div>
                </Col>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <i className="fas fa-mobile-alt"></i>
                    </div>
                    <h5>Mobile Friendly</h5>
                    <p>Access your passport anywhere, on any device.</p>
                  </div>
                </Col>
                <Col sm={6} lg={3} xl={3} className="mb-4">
                  <div className="feature-card">
                    <div className="feature-icon-large mb-3">
                      <i className="fas fa-heart"></i>
                    </div>
                    <h5>Build Understanding</h5>
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
                <i className="fas fa-cogs me-2"></i>
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
                    <i className="fas fa-rocket"></i>
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
