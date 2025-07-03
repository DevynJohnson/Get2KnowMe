// client/hooks/useTokenExpiration.js
import { useEffect, useCallback } from 'react';
import { useAuth } from '../utils/AuthContext.jsx';
import AuthService from '../utils/auth.js';

export const useTokenExpiration = () => {
  const { user, logout } = useAuth();

  const handleTokenExpiration = useCallback(() => {
    const message = "You have been logged out due to inactivity. Please log in again to access your Communication Passport.";
    
    // Use the AuthService logout with message
    AuthService.logout(message);
    
    // Also update the context state
    logout();
  }, [logout]);

  const checkTokenExpiration = useCallback(() => {
    if (!user) return;

    const token = AuthService.getToken();
    if (!token) {
      logout();
      return;
    }

    if (AuthService.isTokenExpired(token)) {
      handleTokenExpiration();
    }
  }, [user, logout, handleTokenExpiration]);

  useEffect(() => {
    if (!user) return;

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check every 30 seconds for more responsive detection
    const interval = setInterval(checkTokenExpiration, 30000);

    // Also check when the page becomes visible again (user returns from another tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTokenExpiration();
      }
    };

    // Check when user interacts with the page (mouse move, key press, etc.)
    const handleUserActivity = () => {
      // Only check if user is active to avoid unnecessary checks
      checkTokenExpiration();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
    };
  }, [user, checkTokenExpiration]);

  return null;
};
