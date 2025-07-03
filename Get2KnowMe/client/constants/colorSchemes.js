// client/constants/colorSchemes.js
// Centralized color scheme definitions to avoid duplication and inconsistencies

// Helper function to get the first color scheme key for a theme
export const getDefaultColorScheme = (theme) => {
  const schemes = colorSchemes[theme];
  return schemes ? Object.keys(schemes)[0] : null;
};

// Helper function to detect user's preferred color scheme
export const getDefaultTheme = () => {
  // Check if user has previously saved a preference
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  // Use browser preference as default
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const colorSchemes = {
  light: {
    turquoise: {
      name: 'Turquoise Breeze',
      primary: '#4c93a1',     // Azure from logo
      secondary: '#8dd0c5',   // Turquoise from logo
      accent: '#f3b256',      // Orange from logo
      neutral: '#6b7280',     // Neutral gray
      gradient: 'linear-gradient(135deg, #4c93a1 0%, #8dd0c5 100%)',
      secondaryGradient: 'linear-gradient(135deg, #8dd0c5 0%, #a3ddd6 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #a3ddd6 0%, #8dd0c5 100%)',
      accentGradient: 'linear-gradient(135deg, #f3b256 0%, #f7c677 100%)',
      preview: '#4c93a1'
    },
    sage: {
      name: 'Sage Garden',
      primary: '#7a8471',     // Muted green-gray complementing light yellow green
      secondary: '#b8c5a8',   // Softened version of light yellow green
      accent: '#8dd0c5',      // Turquoise from logo
      neutral: '#6b7280',     // Neutral gray
      gradient: 'linear-gradient(135deg, #7a8471 0%, #b8c5a8 100%)',
      secondaryGradient: 'linear-gradient(135deg, #b8c5a8 0%, #c8d4bb 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #c8d4bb 0%, #b8c5a8 100%)',
      accentGradient: 'linear-gradient(135deg, #8dd0c5 0%, #a3ddd6 100%)',
      preview: '#7a8471'
    },
    azure: {
      name: 'Azure Sky',
      primary: '#4c93a1',     // Azure from logo
      secondary: '#6ba3b0',   // Deeper azure
      accent: '#2d5a42',      // Darker green for better visibility on light backgrounds
      neutral: '#6b7280',     // Neutral gray
      gradient: 'linear-gradient(135deg, #4c93a1 0%, #6ba3b0 100%)',
      secondaryGradient: 'linear-gradient(135deg, #6ba3b0 0%, #7eb1bd 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #7eb1bd 0%, #6ba3b0 100%)',
      accentGradient: 'linear-gradient(135deg, #2d5a42 0%, #3d6b52 100%)',
      preview: '#4c93a1'
    }
  },
  dark: {
    midnight: {
      name: 'Midnight Ocean',
      primary: '#8dd0c5',     // Turquoise from logo (bright for dark theme)
      secondary: '#4c93a1',   // Azure from logo
      accent: '#f3b256',      // Orange from logo
      neutral: '#9ca3af',     // Light gray for dark theme
      gradient: 'linear-gradient(135deg, #132835 0%, #1a3540 100%)', // Dark Azure base
      secondaryGradient: 'linear-gradient(135deg, #4c93a1 0%, #8dd0c5 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #8dd0c5 0%, #4c93a1 100%)',
      accentGradient: 'linear-gradient(135deg, #f3b256 0%, #f7c677 100%)',
      preview: '#132835',
      // Dark mode specific colors
      bgColor: '#0f1419',      // Very dark background
      cardBg: '#1a2832',       // Lighter card background
      textColor: '#f8fafc',    // Much lighter text (almost white)
      textMuted: '#cbd5e1',    // Lighter muted text
      borderColor: '#374151'   // Border color
    },
    forest: {
      name: 'Forest Night',
      primary: '#b8c5a8',     // Light sage for dark theme
      secondary: '#8dd0c5',   // Turquoise from logo
      accent: '#f3b256',      // Orange from logo
      neutral: '#9ca3af',     // Light gray for dark theme
      gradient: 'linear-gradient(135deg, #2d3328 0%, #3a4134 100%)', // Dark forest base
      secondaryGradient: 'linear-gradient(135deg, #8dd0c5 0%, #b8c5a8 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #b8c5a8 0%, #8dd0c5 100%)',
      accentGradient: 'linear-gradient(135deg, #f3b256 0%, #f7c677 100%)',
      preview: '#2d3328',
      // Dark mode specific colors
      bgColor: '#1a1f1a',      // Very dark forest background
      cardBg: '#2d3328',       // Lighter card background
      textColor: '#f8fafc',    // Much lighter text (almost white)
      textMuted: '#cbd5e1',    // Lighter muted text
      borderColor: '#374151'   // Border color
    },
    slate: {
      name: 'Slate Depths',
      primary: '#a3ddd6',     // Lighter turquoise for dark theme
      secondary: '#6ba3b0',   // Mid-tone azure
      accent: '#f7f9eb',      // Light yellow green from logo
      neutral: '#9ca3af',     // Light gray for dark theme
      gradient: 'linear-gradient(135deg, #2a3b42 0%, #3d5159 100%)', // Dark slate base
      secondaryGradient: 'linear-gradient(135deg, #6ba3b0 0%, #a3ddd6 100%)',
      secondaryGradientReverse: 'linear-gradient(135deg, #a3ddd6 0%, #6ba3b0 100%)',
      accentGradient: 'linear-gradient(135deg, #f7f9eb 0%, #fafbf4 100%)',
      preview: '#2a3b42',
      // Dark mode specific colors
      bgColor: '#1a2328',      // Very dark slate background
      cardBg: '#2a3b42',       // Lighter card background
      textColor: '#f8fafc',    // Much lighter text (almost white)
      textMuted: '#cbd5e1',    // Lighter muted text
      borderColor: '#374151'   // Border color
    }
  }
};

// Colorblind type definitions with appropriate color palettes
export const colorblindTypes = {
  protanopia: {
    name: 'Protanopia (Red-blind)',
    description: 'Difficulty distinguishing red and green',
    colors: {
      light: {
        primary: '#0073e6',      // Strong blue - highly visible
        secondary: '#ffb000',    // Amber/orange - distinguishable from blue
        accent: '#6a4c93',       // Purple - works well with blue/orange
        neutral: '#5a5a5a'       // Dark gray
      },
      dark: {
        primary: '#4da6ff',      // Lighter blue for dark backgrounds
        secondary: '#ffcc4d',    // Lighter amber for dark backgrounds
        accent: '#9973b3',       // Lighter purple for dark backgrounds
        neutral: '#a3a3a3'       // Light gray for dark backgrounds
      }
    }
  },
  deuteranopia: {
    name: 'Deuteranopia (Green-blind)',
    description: 'Difficulty distinguishing red and green',
    colors: {
      light: {
        primary: '#0066cc',      // Medium blue - easily distinguished
        secondary: '#ff9500',    // Orange - highly distinguishable from blue
        accent: '#9900cc',       // Magenta - works well for accents
        neutral: '#666666'       // Medium gray
      },
      dark: {
        primary: '#4d9fff',      // Lighter blue for dark backgrounds
        secondary: '#ffb84d',    // Lighter orange for dark backgrounds
        accent: '#cc4dff',       // Lighter magenta for dark backgrounds
        neutral: '#b3b3b3'       // Light gray for dark backgrounds
      }
    }
  },
  tritanopia: {
    name: 'Tritanopia (Blue-blind)',
    description: 'Difficulty distinguishing blue and yellow',
    colors: {
      light: {
        primary: '#cc0000',      // Red - highly distinguishable
        secondary: '#00cc66',    // Green - works well with red
        accent: '#ff6600',       // Orange-red - distinguishable accent
        neutral: '#666666'       // Medium gray
      },
      dark: {
        primary: '#ff4d4d',      // Lighter red for dark backgrounds
        secondary: '#4dff99',    // Lighter green for dark backgrounds
        accent: '#ff9966',       // Lighter orange for dark backgrounds
        neutral: '#b3b3b3'       // Light gray for dark backgrounds
      }
    }
  },
  monochromacy: {
    name: 'Monochromacy (Total colorblind)',
    description: 'Complete inability to distinguish colors',
    colors: {
      light: {
        primary: '#1a1a1a',      // Very dark gray - high contrast
        secondary: '#4d4d4d',    // Medium-dark gray
        accent: '#808080',       // Medium gray
        neutral: '#b3b3b3'       // Light gray
      },
      dark: {
        primary: '#e6e6e6',      // Very light gray for dark backgrounds
        secondary: '#cccccc',    // Light gray
        accent: '#999999',       // Medium gray
        neutral: '#666666'       // Darker gray
      }
    }
  }
};

// Utility function to apply color scheme to document
export const applyColorScheme = (selectedTheme, selectedColorScheme, isColorblindMode = false, cbType = 'protanopia') => {
  // Apply theme to document first (for both colorblind and regular modes)
  if (selectedTheme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.body.classList.add('dark-theme');
  } else {
    document.documentElement.removeAttribute('data-bs-theme');
    document.body.classList.remove('dark-theme');
  }

  // Apply colorblind mode if enabled
  if (isColorblindMode) {
    document.documentElement.setAttribute('data-colorblind', 'true');
    const cbColors = colorblindTypes[cbType].colors[selectedTheme];
    document.documentElement.style.setProperty('--primary-color', cbColors.primary);
    document.documentElement.style.setProperty('--secondary-color', cbColors.secondary);
    document.documentElement.style.setProperty('--accent-color', cbColors.accent);
    document.documentElement.style.setProperty('--neutral-color', cbColors.neutral);
    document.documentElement.style.setProperty('--gradient-bg', `linear-gradient(135deg, ${cbColors.primary} 0%, ${cbColors.secondary} 100%)`);
    document.documentElement.style.setProperty('--secondary-gradient', `linear-gradient(135deg, ${cbColors.secondary} 0%, ${cbColors.accent} 100%)`);
    document.documentElement.style.setProperty('--secondary-gradient-reverse', `linear-gradient(135deg, ${cbColors.accent} 0%, ${cbColors.secondary} 100%)`);
    document.documentElement.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${cbColors.accent} 0%, ${cbColors.neutral} 100%)`);
    document.documentElement.style.setProperty('--preview-color', cbColors.primary);
    return;
  } else {
    document.documentElement.removeAttribute('data-colorblind');
  }
  
  const scheme = colorSchemes[selectedTheme]?.[selectedColorScheme];
  
  // Check if scheme exists, fallback to default if not
  if (!scheme) {
    console.warn(`Color scheme ${selectedColorScheme} not found for theme ${selectedTheme}, using turquoise as fallback`);
    const fallbackScheme = colorSchemes[selectedTheme]?.turquoise || colorSchemes.light.turquoise;
    document.documentElement.style.setProperty('--primary-color', fallbackScheme.primary);
    document.documentElement.style.setProperty('--secondary-color', fallbackScheme.secondary);
    document.documentElement.style.setProperty('--accent-color', fallbackScheme.accent);
    document.documentElement.style.setProperty('--neutral-color', fallbackScheme.neutral);
    document.documentElement.style.setProperty('--gradient-bg', fallbackScheme.gradient);
    document.documentElement.style.setProperty('--secondary-gradient', fallbackScheme.secondaryGradient);
    document.documentElement.style.setProperty('--secondary-gradient-reverse', fallbackScheme.secondaryGradientReverse);
    document.documentElement.style.setProperty('--accent-gradient', fallbackScheme.accentGradient);
    document.documentElement.style.setProperty('--preview-color', fallbackScheme.preview);
    
    // Apply background and card colors if available (for dark mode)
    if (fallbackScheme.bgColor) {
      document.documentElement.style.setProperty('--bg-color', fallbackScheme.bgColor);
    }
    if (fallbackScheme.cardBg) {
      document.documentElement.style.setProperty('--card-bg', fallbackScheme.cardBg);
    }
    if (fallbackScheme.textColor) {
      document.documentElement.style.setProperty('--text-color', fallbackScheme.textColor);
    }
    if (fallbackScheme.textMuted) {
      document.documentElement.style.setProperty('--text-muted', fallbackScheme.textMuted);
    }
    if (fallbackScheme.borderColor) {
      document.documentElement.style.setProperty('--border-color', fallbackScheme.borderColor);
    }
    return;
  }

  // Apply color scheme CSS custom properties
  document.documentElement.style.setProperty('--primary-color', scheme.primary);
  document.documentElement.style.setProperty('--secondary-color', scheme.secondary);
  document.documentElement.style.setProperty('--accent-color', scheme.accent);
  document.documentElement.style.setProperty('--neutral-color', scheme.neutral);
  document.documentElement.style.setProperty('--gradient-bg', scheme.gradient);
  document.documentElement.style.setProperty('--secondary-gradient', scheme.secondaryGradient);
  document.documentElement.style.setProperty('--secondary-gradient-reverse', scheme.secondaryGradientReverse);
  document.documentElement.style.setProperty('--accent-gradient', scheme.accentGradient);
  document.documentElement.style.setProperty('--preview-color', scheme.preview);
  
  // Apply background and card colors if available (for dark mode)
  if (scheme.bgColor) {
    document.documentElement.style.setProperty('--bg-color', scheme.bgColor);
  }
  if (scheme.cardBg) {
    document.documentElement.style.setProperty('--card-bg', scheme.cardBg);
  }
  if (scheme.textColor) {
    document.documentElement.style.setProperty('--text-color', scheme.textColor);
  }
  if (scheme.textMuted) {
    document.documentElement.style.setProperty('--text-muted', scheme.textMuted);
  }
  if (scheme.borderColor) {
    document.documentElement.style.setProperty('--border-color', scheme.borderColor);
  }
};
