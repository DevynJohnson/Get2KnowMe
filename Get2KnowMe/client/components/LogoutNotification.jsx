// client/components/LogoutNotification.jsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const LogoutNotification = () => {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check for logout message in sessionStorage
    const logoutMessage = sessionStorage.getItem('logoutMessage');
    if (logoutMessage) {
      setMessage(logoutMessage);
      setShow(true);
      // Clear the message from storage
      sessionStorage.removeItem('logoutMessage');
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShow(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show || !message) return null;

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 1050, marginTop: '20px' }}>
      <Alert 
        variant="warning" 
        dismissible 
        onClose={() => setShow(false)}
        className="shadow-lg"
        style={{ minWidth: '400px', maxWidth: '600px' }}
      >
        <Alert.Heading>
          <i className="fas fa-clock me-2"></i>
          Session Expired
        </Alert.Heading>
        <p className="mb-0">{message}</p>
      </Alert>
    </div>
  );
};

export default LogoutNotification;
