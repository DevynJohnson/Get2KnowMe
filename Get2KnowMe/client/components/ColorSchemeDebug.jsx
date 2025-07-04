// client/components/ColorSchemeDebug.jsx
import React, { useState, useEffect } from 'react';

const ColorSchemeDebug = () => {
  const [cssVars, setCssVars] = useState({});
  const [localStorageVars, setLocalStorageVars] = useState({});

  useEffect(() => {
    const updateDebugInfo = () => {
      // Get CSS custom properties
      const computedStyle = getComputedStyle(document.documentElement);
      setCssVars({
        '--primary-color': computedStyle.getPropertyValue('--primary-color').trim(),
        '--secondary-color': computedStyle.getPropertyValue('--secondary-color').trim(),
        '--accent-color': computedStyle.getPropertyValue('--accent-color').trim(),
        '--neutral-color': computedStyle.getPropertyValue('--neutral-color').trim(),
        '--gradient-bg': computedStyle.getPropertyValue('--gradient-bg').trim(),
        '--secondary-gradient': computedStyle.getPropertyValue('--secondary-gradient').trim(),
        '--preview-color': computedStyle.getPropertyValue('--preview-color').trim(),
      });

      // Get localStorage values
      setLocalStorageVars({
        theme: localStorage.getItem('theme') || 'not set',
        colorScheme: localStorage.getItem('colorScheme') || 'not set',
        colorblindMode: localStorage.getItem('colorblindMode') || 'not set',
        colorblindType: localStorage.getItem('colorblindType') || 'not set',
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h6>Color Scheme Debug</h6>
      
      <h7>localStorage:</h7>
      <ul style={{ margin: '5px 0', padding: '0 0 0 15px' }}>
        {Object.entries(localStorageVars).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>

      <h7>CSS Variables:</h7>
      <ul style={{ margin: '5px 0', padding: '0 0 0 15px' }}>
        {Object.entries(cssVars).map(([key, value]) => (
          <li key={key}>
            {key}: <span style={{ color: value || 'red' }}>{value || 'not set'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorSchemeDebug;
