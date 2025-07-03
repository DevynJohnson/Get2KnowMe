// client/hooks/useColorSchemeManager.js
import { useState, useCallback } from 'react';
import { applyColorScheme } from '../constants/colorSchemes.js';

export const useColorSchemeManager = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('colorScheme') || 'orange');
  const [colorblindMode, setColorblindMode] = useState(() => localStorage.getItem('colorblindMode') === 'true');
  const [colorblindType, setColorblindType] = useState(() => localStorage.getItem('colorblindType') || 'protanopia');

  const updateTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyColorScheme(newTheme, colorScheme, colorblindMode, colorblindType);
  }, [colorScheme, colorblindMode, colorblindType]);

  const updateColorScheme = useCallback((newColorScheme) => {
    setColorScheme(newColorScheme);
    localStorage.setItem('colorScheme', newColorScheme);
    applyColorScheme(theme, newColorScheme, colorblindMode, colorblindType);
  }, [theme, colorblindMode, colorblindType]);

  const updateColorblindMode = useCallback((newColorblindMode) => {
    setColorblindMode(newColorblindMode);
    localStorage.setItem('colorblindMode', newColorblindMode.toString());
    applyColorScheme(theme, colorScheme, newColorblindMode, colorblindType);
  }, [theme, colorScheme, colorblindType]);

  const updateColorblindType = useCallback((newColorblindType) => {
    setColorblindType(newColorblindType);
    localStorage.setItem('colorblindType', newColorblindType);
    applyColorScheme(theme, colorScheme, colorblindMode, newColorblindType);
  }, [theme, colorScheme, colorblindMode]);

  const applyCurrentScheme = useCallback(() => {
    applyColorScheme(theme, colorScheme, colorblindMode, colorblindType);
  }, [theme, colorScheme, colorblindMode, colorblindType]);

  return {
    theme,
    colorScheme,
    colorblindMode,
    colorblindType,
    updateTheme,
    updateColorScheme,
    updateColorblindMode,
    updateColorblindType,
    applyCurrentScheme
  };
};
