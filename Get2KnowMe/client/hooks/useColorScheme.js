// client/hooks/useColorScheme.js
import { useEffect } from 'react';
import { applyColorScheme, getDefaultTheme, getDefaultColorScheme } from '../constants/colorSchemes.js';

export const useColorScheme = () => {
  useEffect(() => {
    // Determine the default theme based on browser preferences or saved settings
    const defaultTheme = getDefaultTheme();
    
    // Get the saved theme or use the default
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    
    // Get the default color scheme for the current theme
    const defaultColorScheme = getDefaultColorScheme(savedTheme);
    
    // Load and apply saved settings with proper defaults
    const savedColorScheme = localStorage.getItem('colorScheme') || defaultColorScheme;
    const savedColorblindMode = localStorage.getItem('colorblindMode') === 'true';
    const savedColorblindType = localStorage.getItem('colorblindType') || 'protanopia';
    
    // If this is the first time loading (no saved theme), save the default theme
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', savedTheme);
    }
    
    // If this is the first time loading or the saved color scheme doesn't exist for current theme,
    // use the default color scheme for the current theme
    if (!localStorage.getItem('colorScheme') || !savedColorScheme) {
      localStorage.setItem('colorScheme', defaultColorScheme);
    }
    
    applyColorScheme(savedTheme, savedColorScheme || defaultColorScheme, savedColorblindMode, savedColorblindType);
  }, []); // Empty dependency array means this runs once on mount

  return null; // This hook doesn't return anything, just applies effects
};
