
// client/utils/auth.js
import { jwtDecode } from 'jwt-decode';

class AuthService {
  refreshTimer = null;

  // Retrieve and decode the stored token
  getProfile() {
    try {
      const token = this.getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      // Normalize the user ID field to match server response
      if (decoded.id && !decoded._id) {
        decoded._id = decoded.id;
      }
      return decoded;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  // Check if the user is logged in by verifying token existence and validity
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check token expiration
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      // Expiration is in seconds, so divide Date.now() by 1000
      return decoded?.exp && decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true;
    }
  }

  // Get time until token expiration in milliseconds
  getTimeUntilExpiration(token) {
    try {
      const decoded = jwtDecode(token);
      if (!decoded?.exp) return 0;
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return Math.max(0, expirationTime - currentTime);
    } catch (err) {
      console.error('Error getting time until expiration:', err);
      return 0;
    }
  }

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon(token) {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    return timeUntilExpiration <= 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  // Retrieve token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Log in by saving the token and redirecting to home
  login(idToken) {
    try {
      localStorage.setItem('id_token', idToken);
      this.setupTokenRefresh(); // Setup auto-refresh for new token
      window.location.assign('/');
    } catch (err) {
      console.error('Error saving token:', err);
    }
  }

  // Log out by removing the token and redirecting
  logout(message = null) {
    try {
      // Clear refresh timer
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }

      // Revoke refresh token on server
      fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      }).catch((err) => console.error('Error revoking refresh token:', err));

      localStorage.removeItem('id_token');
      
      // If a message is provided, store it for display
      if (message) {
        sessionStorage.setItem('logoutMessage', message);
      }
      
      window.location.href = '/';
    } catch (err) {
      console.error('Error removing token:', err);
    }
  }

  // Check authentication status on page load (optional)
  checkAuthOnPageLoad() {
    if (this.loggedIn()) {
      console.log('User is logged in');
      this.setupTokenRefresh(); // Setup auto-refresh for existing token
    } else {
      console.log('User is not logged in');
    }
  }

  // Setup automatic token refresh before expiration
  setupTokenRefresh() {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiration = expiresAt - now;

      // Refresh 2 minutes before expiration (or immediately if less than 2 minutes)
      const refreshTime = Math.max(0, timeUntilExpiration - (2 * 60 * 1000));

      // Clear existing timer
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      // Only setup refresh if token hasn't expired
      if (timeUntilExpiration > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
        console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000)}s`);
      }
    } catch (err) {
      console.error('Failed to setup auto-refresh:', err);
    }
  }

  // Refresh the access token using the refresh token
  async refreshToken() {
    try {
      const response = await fetch('/api/users/refresh-token', {
        method: 'POST',
        credentials: 'include', // Send refresh token cookie
      });

      if (!response.ok) {
        // Refresh token expired or invalid, redirect to login
        console.log('Refresh token expired, logging out');
        this.logout('Your session has expired. Please log in again.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('id_token', data.token);
      console.log('Token refreshed successfully');

      // Setup next refresh
      this.setupTokenRefresh();

      return data.token;
    } catch (err) {
      console.error('Token refresh failed:', err);
      this.logout('Your session has expired. Please log in again.');
    }
  }

  // Clear refresh timer (call on unmount or logout)
  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // CSRF token cache
  _csrfToken = null;

  // Get CSRF token (cached)
  async getCsrfToken() {
    if (this._csrfToken) {
      return this._csrfToken;
    }

    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include',
      });
      const data = await response.json();
      this._csrfToken = data.csrfToken;
      return this._csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return null;
    }
  }

  // Clear cached CSRF token (call this on 403 CSRF errors)
  clearCsrfToken() {
    this._csrfToken = null;
  }

  // Helper for making authenticated requests with CSRF protection
  async authenticatedFetch(url, options = {}) {
    const token = this.getToken();
    const csrfToken = await this.getCsrfToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (csrfToken) {
      headers['csrf-token'] = csrfToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // If CSRF token is invalid, clear cache and retry once
    if (response.status === 403) {
      const errorData = await response.json();
      if (errorData.code === 'EBADCSRFTOKEN') {
        this.clearCsrfToken();
        // Optionally retry the request once with a fresh token
        const newCsrfToken = await this.getCsrfToken();
        if (newCsrfToken) {
          headers['csrf-token'] = newCsrfToken;
          return fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
        }
      }
    }

    return response;
  }
}

export default new AuthService();
