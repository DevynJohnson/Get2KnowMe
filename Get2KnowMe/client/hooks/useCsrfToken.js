// client/hooks/useCsrfToken.js
import { useState, useEffect } from 'react';

/**
 * Hook to fetch and manage CSRF token
 * @returns {Object} { csrfToken, loading }
 */
export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { csrfToken, loading };
};
