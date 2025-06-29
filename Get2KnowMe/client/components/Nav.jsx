// client/components/Nav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav as BsNav, Container } from "react-bootstrap";
import AuthService from "../utils/auth.js";
import "../styles/Nav.css";

const NavTabs = () => {
  // Get the current path for active styling
  const currentPage = useLocation().pathname;

  // Get user profile (null if not logged in)
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch (error) {
    console.warn("Error getting user profile:", error);
    user = null;
  }

  // Function to log out the user
  const handleLogout = () => {
    try {
      AuthService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Navbar bg="light" data-bs-theme="light" expand="md" sticky="top" className="custom-navbar">
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="brand-link">
          Get2KnowMe
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <BsNav className="mx-auto navbar-nav-centered">
            <BsNav.Link 
              as={Link} 
              to="/" 
              active={currentPage === "/"}
              className="nav-item-custom"
            >
              Home
            </BsNav.Link>

            {/* Public access to Communication Passports */}
            <BsNav.Link
              as={Link}
              to="/passport-lookup"
              active={currentPage === "/passport-lookup"}
              className="nav-item-custom"
            >
              View Passport
            </BsNav.Link>

            {/* Show login if no user, otherwise show authenticated user options */}
            {!user ? (
              <BsNav.Link
                as={Link}
                to="/login"
                active={currentPage === "/login"}
                className="nav-item-custom"
              >
                Login
              </BsNav.Link>
            ) : (
              <>
                <BsNav.Link
                  as={Link}
                  to="/create-passport"
                  active={currentPage === "/create-passport"}
                  className="nav-item-custom"
                >
                  My Passport
                </BsNav.Link>

                <BsNav.Link 
                  onClick={handleLogout} 
                  className="nav-item-custom logout-btn"
                >
                  Logout
                </BsNav.Link>
              </>
            )}
          </BsNav>
          
          {/* User info section - positioned to the right */}
          {user && (
            <div className="navbar-text user-info d-none d-md-block">
              Welcome, {user.username || user.email || 'User'}!
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavTabs;
