import React from "react";
import get2knowmeLogo from "/get2knowme_logo_png.png";
import '../styles/Footer.css';

const Footer = () => (
  <footer className="py-4 text-muted">
    <div className="container">
      <div className="row align-items-start">
        {/* Logo and Copyright Section */}
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-3">
            <img 
              src={get2knowmeLogo} 
              alt="Get2KnowMe Logo" 
              className="footer-logo me-3"
            />
            <div>
              <div className="fw-bold text-dark">Get2KnowMe</div>
              <small className="text-muted">© 2025 Get2KnowMe. All rights reserved.</small>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="col-md-6">
          <div className="d-flex justify-content-md-end justify-content-center gap-5">
            {/* Legal Section */}
            <div className="text-start">
              <h6 className="footer-title text-decoration-underline mb-3 fw-semibold">Legal</h6>
              <div className="d-flex flex-column gap-2">
                <a href="/policy/UserInfo" className="footer-link text-decoration-none">
                  Privacy Policy
                </a>
                <a href="/policy/terms-of-service" className="footer-link text-decoration-none">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Services Section */}
            <div className="text-start">
              <h6 className="footer-title text-decoration-underline mb-3 fw-semibold">Services</h6>
              <div className="d-flex flex-column gap-2">
                <a href="/dashboard" className="footer-link text-decoration-none">
                  Follow Users
                </a>
                <a href="/stories" className="footer-link text-decoration-none">
                  View Stories
                </a>
                <a href="/learn-more" className="footer-link text-decoration-none">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;