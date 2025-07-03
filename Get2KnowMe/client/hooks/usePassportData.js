// client/hooks/usePassportData.js
import { useState, useEffect, useCallback } from 'react';
import AuthService from '../utils/auth.js';

// Global passport data cache to share between components
let globalPassportCache = {
  data: null,
  timestamp: null,
  hasPassport: false
};

export const usePassportData = () => {
  const [passportData, setPassportData] = useState(globalPassportCache.data);
  const [hasPassport, setHasPassport] = useState(globalPassportCache.hasPassport);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info
  const user = AuthService.loggedIn() ? AuthService.getProfile() : null;

  const fetchPassportData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setIsLoading(false);
      setHasPassport(false);
      setPassportData(null);
      return null;
    }

    // Check cache first (unless force refresh)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (!forceRefresh && globalPassportCache.data && globalPassportCache.timestamp && 
        (now - globalPassportCache.timestamp) < fiveMinutes) {
      setPassportData(globalPassportCache.data);
      setHasPassport(globalPassportCache.hasPassport);
      setIsLoading(false);
      return globalPassportCache.data;
    }

    try {
      setError(null);
      const token = AuthService.getToken();
      const response = await fetch("/api/passport/my-passport", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update global cache
        globalPassportCache = {
          data: data.passport,
          timestamp: now,
          hasPassport: true
        };

        setPassportData(data.passport);
        setHasPassport(true);
        
        // Also cache in sessionStorage as backup
        sessionStorage.setItem('passportData', JSON.stringify(data.passport));
        sessionStorage.setItem('passportDataTimestamp', now.toString());
        
        return data.passport;
      } else if (response.status === 404) {
        // No passport found
        globalPassportCache = {
          data: null,
          timestamp: now,
          hasPassport: false
        };
        
        setPassportData(null);
        setHasPassport(false);
        
        // Clear stale cache
        sessionStorage.removeItem('passportData');
        sessionStorage.removeItem('passportDataTimestamp');
        
        return null;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching passport data:", err);
      setError(err.message);
      
      // Try to use sessionStorage as fallback
      const cachedData = sessionStorage.getItem('passportData');
      const cacheTimestamp = sessionStorage.getItem('passportDataTimestamp');
      
      if (cachedData && cacheTimestamp) {
        try {
          const parsed = JSON.parse(cachedData);
          const cacheAge = now - parseInt(cacheTimestamp);
          
          // Use stale cache if it's less than 1 hour old and we have network issues
          if (cacheAge < 60 * 60 * 1000) { // 1 hour
            setPassportData(parsed);
            setHasPassport(true);
            return parsed;
          }
        } catch (parseErr) {
          console.error('Error parsing cached data:', parseErr);
        }
      }
      
      setPassportData(null);
      setHasPassport(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Clear cache when user changes
  useEffect(() => {
    if (!user) {
      globalPassportCache = { data: null, timestamp: null, hasPassport: false };
      setPassportData(null);
      setHasPassport(false);
      setIsLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchPassportData();
  }, [fetchPassportData]);

  // Helper functions
  const getDisplayName = () => {
    if (!passportData) return user?.username || user?.email || '';
    return passportData.preferredName || passportData.firstName || user?.username || user?.email || '';
  };

  const getPassportCode = () => {
    return passportData?.profilePasscode || '';
  };

  const refreshPassportData = () => {
    return fetchPassportData(true);
  };

  const clearCache = () => {
    globalPassportCache = { data: null, timestamp: null, hasPassport: false };
    sessionStorage.removeItem('passportData');
    sessionStorage.removeItem('passportDataTimestamp');
  };

  return {
    passportData,
    hasPassport,
    isLoading,
    error,
    displayName: getDisplayName(),
    passportCode: getPassportCode(),
    refreshPassportData,
    clearCache
  };
};
