// client/components/Nav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav as BsNav, Container } from 'react-bootstrap';
import AuthService from '../utils/auth.js';
import '../styles/Nav.css';

const NavTabs = () => {
  // Get the current path for active styling
  const currentPage = useLocation().pathname;
  
  // Get user profile (null if not logged in)
  let user = null;
  try {
    user = AuthService.getProfile();
  } catch (error) {
    console.warn('Error getting user profile:', error);
    user = null;
  }

  // Function to log out the user
  const handleLogout = () => {
    try {
      AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Navbar bg="light" data-bs-theme="light" expand="md" sticky="top">
      <Container>
        <Navbar.Brand>Get2KnowMe</Navbar.Brand>
        <BsNav variant="tabs" className="me-auto mx-auto">
          <BsNav.Link as={Link} to="/" active={currentPage === '/'}>
            Home
          </BsNav.Link>
          
          {/* Public access to Communication Passports */}
          <BsNav.Link as={Link} to="/passport-lookup" active={currentPage === '/passport-lookup'}>
            View Passport
          </BsNav.Link>
          
          {/* Show login if no user, otherwise show authenticated user options */}
          {!user ? (
            <BsNav.Link as={Link} to="/login" active={currentPage === '/login'}>
              Login
            </BsNav.Link>
          ) : (
            <>
              <BsNav.Link as={Link} to="/create-passport" active={currentPage === '/create-passport'}>
                My Passport
              </BsNav.Link>
              <BsNav.Link disabled className="welcome-text">
                Welcome, {user.username || user.email}!
              </BsNav.Link>
              <BsNav.Link onClick={handleLogout} className="logout-btn">
                Logout
              </BsNav.Link>
            </>
          )}
        </BsNav>
      </Container>

    </Navbar>
  );
};

export default NavTabs;