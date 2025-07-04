// client/components/Nav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav as BsNav, Container, NavDropdown } from "react-bootstrap";
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
              View A Passport
            </BsNav.Link>

            {/* Authenticated user passport link OR Create Account for non-authenticated */}
            {user ? (
              <BsNav.Link
                as={Link}
                to="/profile"
                active={currentPage === "/profile"}
                className="nav-item-custom"
              >
                My Profile
              </BsNav.Link>
            ) : (
              <BsNav.Link
                as={Link}
                to="/register"
                active={currentPage === "/register"}
                className="nav-item-custom"
              >
                Create Account
              </BsNav.Link>
            )}

            {/* Learn More link - available to all users */}
            <BsNav.Link
              as={Link}
              to="/learn-more"
              active={currentPage === "/learn-more"}
              className="nav-item-custom"
            >
              Learn More
            </BsNav.Link>
          </BsNav>
          
          {/* Right side navigation - Settings and Login/Logout */}
          <BsNav className="ms-auto">
            {/* Settings Dropdown - Available for all users */}
            <li className="nav-item dropdown">
              <button
                className="nav-link nav-item-custom btn btn-link settings-dropdown-btn"
                id="settings-dropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-cog me-1"></i>
                Settings
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settings-dropdown">
                {user ? (
                  <>
                    <li><h6 className="dropdown-header"><i className="fas fa-user me-2"></i>Account Settings</h6></li>
                    <li><Link className="dropdown-item" to="/settings/profile">
                      <i className="fas fa-user me-2"></i>Profile Settings
                    </Link></li>
                    <li><Link className="dropdown-item" to="/settings/security">
                      <i className="fas fa-shield-alt me-2"></i>Security & Password
                    </Link></li>
                    <li><Link className="dropdown-item" to="/settings/appearance">
                      <i className="fas fa-palette me-2"></i>Appearance
                    </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item text-danger" to="/settings/danger-zone">
                      <i className="fas fa-exclamation-triangle me-2"></i>Danger Zone
                    </Link></li>
                  </>
                ) : (
                  <>
                    <li><h6 className="dropdown-header"><i className="fas fa-user-plus me-2"></i>Create Account to Access</h6></li>
                    <li><Link className="dropdown-item" to="/register">
                      <i className="fas fa-user me-2"></i>Profile Settings
                    </Link></li>
                    <li><Link className="dropdown-item" to="/register">
                      <i className="fas fa-shield-alt me-2"></i>Security & Password
                    </Link></li>
                    <li><Link className="dropdown-item" to="/settings/appearance">
                      <i className="fas fa-palette me-2"></i>Appearance
                    </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/register">
                      <i className="fas fa-rocket me-2"></i>Create Account
                    </Link></li>
                  </>
                )}
              </ul>
            </li>

            {!user ? (
              <BsNav.Link
                as={Link}
                to="/login"
                active={currentPage === "/login"}
                className="nav-item-custom"
              >
                <i className="fas fa-sign-in-alt me-1"></i>
                Login
              </BsNav.Link>
            ) : (
              <>
                {/* Logout Button */}
                <BsNav.Link 
                  onClick={handleLogout} 
                  className="nav-item-custom logout-btn"
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </BsNav.Link>
              </>
            )}
          </BsNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavTabs;
