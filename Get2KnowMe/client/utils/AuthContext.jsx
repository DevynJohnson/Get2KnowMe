// client/utils/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from './auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const initializeAuth = () => {
      try {
        if (AuthService.loggedIn()) {
          const userData = AuthService.getProfile();
          const userToken = AuthService.getToken();
          setUser(userData);
          setToken(userToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any invalid tokens
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (idToken, userData) => {
    try {
      AuthService.login(idToken);
      setUser(userData);
      setToken(idToken);
      
      // Prefetch passport data immediately after login for faster UI updates
      try {
        const response = await fetch("/api/passport/my-passport", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Cache the passport data immediately
          const now = Date.now();
          sessionStorage.setItem('passportData', JSON.stringify(data.passport));
          sessionStorage.setItem('passportDataTimestamp', now.toString());
        }
      } catch (passportError) {
        // Don't fail login if passport fetch fails, just log it
        console.warn('Could not prefetch passport data:', passportError);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = (message = null) => {
    try {
      AuthService.logout(message);
      setUser(null);
      setToken(null);
      
      // Clear passport cache on logout
      sessionStorage.removeItem('passportData');
      sessionStorage.removeItem('passportDataTimestamp');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // isAuthenticated is true only if both user and token exist
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token
  };

  // No redirect logic here: do not block or redirect unauthenticated users
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
