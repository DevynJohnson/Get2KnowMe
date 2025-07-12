import React from 'react';
import '../styles/RegistrationPending.css';

const RegistrationPending = () => {
  return (
    <div className="registration-pending-container">
      <h1 className="registration-pending-title">Registration Almost Complete!</h1>
      <p className="registration-pending-message">
        Thank you for registering. To complete your sign up, please check your email inbox for a confirmation message.
      </p>
      <p className="registration-pending-message">
        <strong>If you do not see the email in your inbox within a few minutes, please check your junk or spam folder.</strong>
      </p>
      <p className="registration-pending-message">
        If you still do not receive the email, you may request a new confirmation link from the login page or contact support.
      </p>
    </div>
  );
};

export default RegistrationPending;
