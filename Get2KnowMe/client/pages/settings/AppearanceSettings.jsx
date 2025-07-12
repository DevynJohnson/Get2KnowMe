// client/pages/settings/AppearanceSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Alert, Row, Col } from 'react-bootstrap';
import { colorSchemes, colorblindTypes, applyColorScheme, getDefaultTheme, getDefaultColorScheme } from '../../constants/colorSchemes.js';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState('light');
  const [colorScheme, setColorScheme] = useState('turquoise');
  const [colorblindMode, setColorblindMode] = useState(false);
  const [colorblindType, setColorblindType] = useState('protanopia');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [dyslexiaFont, setDyslexiaFont] = useState(localStorage.getItem('dyslexiaFont') === 'true');

  const applyTheme = useCallback((selectedTheme, selectedColorScheme, isColorblindMode = false, cbType = 'protanopia') => {
    applyColorScheme(selectedTheme, selectedColorScheme, isColorblindMode, cbType);
  }, []);

  useEffect(() => {
    // Load theme and color scheme from localStorage on component mount
    const defaultTheme = getDefaultTheme();
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    const defaultColorScheme = getDefaultColorScheme(savedTheme);
    const savedColorScheme = localStorage.getItem('colorScheme') || defaultColorScheme;
    const savedColorblindMode = localStorage.getItem('colorblindMode') === 'true';
    const savedColorblindType = localStorage.getItem('colorblindType') || 'protanopia';
    
    setTheme(savedTheme);
    setColorScheme(savedColorScheme);
    setColorblindMode(savedColorblindMode);
    setColorblindType(savedColorblindType);
    applyTheme(savedTheme, savedColorScheme, savedColorblindMode, savedColorblindType);
  }, [applyTheme]);

  useEffect(() => {
    if (localStorage.getItem('dyslexiaFont') === 'true') {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
  }, [applyTheme]);

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleThemeChange = (newTheme) => {
    // When switching themes, use the default color scheme for the new theme
    const defaultColorScheme = getDefaultColorScheme(newTheme);
    
    setTheme(newTheme);
    setColorScheme(defaultColorScheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('colorScheme', defaultColorScheme);
    applyTheme(newTheme, defaultColorScheme, colorblindMode, colorblindType);
    showAlert(`Switched to ${newTheme} theme with ${colorSchemes[newTheme][defaultColorScheme].name} color scheme!`);
  };

  const handleColorSchemeChange = (newColorScheme) => {
    // Validate that the color scheme exists
    if (!colorSchemes[theme]?.[newColorScheme]) {
      console.error(`Color scheme ${newColorScheme} not found for theme ${theme}`);
      return;
    }
    
    setColorScheme(newColorScheme);
    localStorage.setItem('colorScheme', newColorScheme);
    applyTheme(theme, newColorScheme, colorblindMode, colorblindType);
    showAlert(`Applied ${colorSchemes[theme][newColorScheme].name} color scheme!`);
  };

  const handleColorblindModeChange = (enabled) => {
    setColorblindMode(enabled);
    localStorage.setItem('colorblindMode', enabled.toString());
    applyTheme(theme, colorScheme, enabled, colorblindType);
    showAlert(enabled ? 'Colorblind-friendly mode enabled!' : 'Colorblind-friendly mode disabled!');
  };

  const handleColorblindTypeChange = (newType) => {
    setColorblindType(newType);
    localStorage.setItem('colorblindType', newType);
    applyTheme(theme, colorScheme, colorblindMode, newType);
    showAlert(`Applied ${colorblindTypes[newType].name} settings!`);
  };

  const handleDyslexiaFontChange = (enabled) => {
    setDyslexiaFont(enabled);
    localStorage.setItem('dyslexiaFont', enabled.toString());
    document.body.classList.toggle('dyslexia-font', enabled);
    showAlert(enabled ? 'Dyslexia-friendly font enabled!' : 'Dyslexia-friendly font disabled!');
  };

  return (
    <>
      <div className="settings-title d-flex justify-content-between align-items-center mb-4">
        <h4>Appearance Settings</h4>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} className="mb-4">
          {alert.message}
        </Alert>
      )}

      {/* Theme Selection */}
      <Card className="mb-4">
        <Card.Header className="gradient-header">
          <h5 className="mb-0 text-white">
            <i className="fas fa-palette me-2"></i>
            Theme Mode
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Choose between light and dark theme modes.
          </p>

          <Row>
            <Col md={6}>
              <Card 
                className={`theme-card ${theme === 'light' ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleThemeChange('light')}
              >
                <Card.Body className="text-center">
                  <div className="theme-preview light-preview mb-3">
                    <div className="preview-header bg-light border-bottom"></div>
                    <div className="preview-content bg-white">
                      <div className="preview-text bg-secondary"></div>
                      <div className="preview-text bg-secondary"></div>
                    </div>
                  </div>
                  <Form.Check
                    type="radio"
                    id="light-theme"
                    name="theme"
                    label="Light Theme"
                    checked={theme === 'light'}
                    onChange={() => handleThemeChange('light')}
                    className="d-inline-block"
                  />
                  <p className="small text-muted mt-2 mb-0">
                    Clean and bright interface
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card 
                className={`theme-card ${theme === 'dark' ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleThemeChange('dark')}
              >
                <Card.Body className="text-center">
                  <div className="theme-preview dark-preview mb-3">
                    <div className="preview-header bg-dark border-bottom"></div>
                    <div className="preview-content bg-secondary">
                      <div className="preview-text bg-light"></div>
                      <div className="preview-text bg-light"></div>
                    </div>
                  </div>
                  <Form.Check
                    type="radio"
                    id="dark-theme"
                    name="theme"
                    label="Dark Theme"
                    checked={theme === 'dark'}
                    onChange={() => handleThemeChange('dark')}
                    className="d-inline-block"
                  />
                  <p className="small text-muted mt-2 mb-0">
                    Easy on the eyes in low light
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Color Scheme Selection */}
      <Card className="mb-4">
        <Card.Header className="gradient-header">
          <h5 className="mb-0 text-white">
            <i className="fas fa-paint-brush me-2"></i>
            Color Scheme
          </h5>
        </Card.Header>
        <Card.Body style={{ opacity: colorblindMode ? 0.5 : 1, pointerEvents: colorblindMode ? 'none' : 'auto' }}>
          {colorblindMode && (
            <Alert variant="info" className="mb-3">
              <i className="fas fa-info-circle me-2"></i>
              Color scheme customization is not available when using colorblind mode.
            </Alert>
          )}
          <p className="text-muted mb-4">
            Choose your preferred color scheme for the {theme} theme.
          </p>

          <Row>
            {Object.entries(colorSchemes[theme] || {}).map(([key, scheme]) => (
              <Col md={4} key={key}>
                <Card 
                  className={`color-scheme-card ${colorScheme === key ? 'border-primary' : ''}`}
                  style={{ cursor: colorblindMode ? 'not-allowed' : 'pointer' }}
                  onClick={() => !colorblindMode && handleColorSchemeChange(key)}
                >
                  <Card.Body className="text-center">
                    <div 
                      className="color-preview mb-3"
                      style={{ 
                        background: colorblindMode 
                          ? `linear-gradient(135deg, ${colorblindTypes[colorblindType].colors[theme].primary} 0%, ${colorblindTypes[colorblindType].colors[theme].secondary} 100%)`
                          : scheme.gradient,
                        height: '60px',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                    ></div>
                    <Form.Check
                      type="radio"
                      id={`${key}-scheme`}
                      name="colorScheme"
                      label={colorblindMode ? 'Colorblind Mode Active' : scheme.name}
                      checked={colorScheme === key}
                      onChange={() => !colorblindMode && handleColorSchemeChange(key)}
                      disabled={colorblindMode}
                      className="d-inline-block"
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Accessibility Options */}
      <Card className="mb-4">
        <Card.Header className="gradient-header">
          <h5 className="mb-0 text-white">
            <i className="fas fa-universal-access me-2"></i>
            Accessibility Options
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Options to reduce visual stimuli and improve accessibility.
          </p>
          <Form.Check
            type="switch"
            id="colorblind-mode"
            label="Colorblind-Friendly Mode"
            checked={colorblindMode}
            onChange={(e) => handleColorblindModeChange(e.target.checked)}
            className="mb-3"
          />
          <Form.Check
            type="switch"
            id="dyslexia-font"
            label="Dyslexia-Friendly Font"
            checked={dyslexiaFont}
            onChange={(e) => handleDyslexiaFontChange(e.target.checked)}
            className="mb-3"
          />
          <Form.Text className="text-muted mb-4 d-block">
            Uses high contrast, safe colors that are easier to distinguish and less overwhelming. 
            Reduces bright colors that may cause sensory overload.
          </Form.Text>

          {colorblindMode && (
            <div className="mt-4 p-3 border rounded">
              <h6 className="mb-3">
                <i className="fas fa-eye me-2"></i>
                Colorblind Type
              </h6>
              <p className="text-muted small mb-3">
                Select your specific type of colorblindness for optimized colors:
              </p>
              
              <Row>
                {Object.entries(colorblindTypes).map(([key, type]) => (
                  <Col md={6} key={key} className="mb-3">
                    <Card 
                      className={`colorblind-type-card ${colorblindType === key ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleColorblindTypeChange(key)}
                    >
                      <Card.Body className="text-center">
                        <div 
                          className="color-preview mb-2"
                          style={{ 
                            background: `linear-gradient(135deg, ${type.colors[theme].primary} 0%, ${type.colors[theme].secondary} 100%)`,
                            height: '40px',
                            borderRadius: '6px',
                            border: '1px solid #dee2e6'
                          }}
                        ></div>
                        <Form.Check
                          type="radio"
                          id={`colorblind-${key}`}
                          name="colorblindType"
                          value={key}
                          checked={colorblindType === key}
                          onChange={(e) => handleColorblindTypeChange(e.target.value)}
                          label={
                            <div>
                              <strong>{type.name}</strong>
                              <br />
                              <small className="text-muted">{type.description}</small>
                            </div>
                          }
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Current Settings Info */}
      <Card>
        <Card.Header className="gradient-header">
          <h5 className="mb-0 text-white">
            <i className="fas fa-info-circle me-2"></i>
            Current Settings
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <h6>Theme Mode</h6>
              <p className="text-muted">
                <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} me-2`}></i>
                {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
              </p>
            </Col>
            <Col md={4}>
              <h6>Color Scheme</h6>
              <p className="text-muted">
                <span 
                  className="color-indicator me-2"
                  style={{ 
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: colorblindMode ? colorblindTypes[colorblindType].colors.primary : (colorSchemes[theme]?.[colorScheme]?.primary || '#ff6b35'),
                    border: '1px solid #dee2e6'
                  }}
                ></span>
                {colorblindMode ? colorblindTypes[colorblindType].name : (colorSchemes[theme]?.[colorScheme]?.name || 'Unknown Color Scheme')}
              </p>
            </Col>
            <Col md={4}>
              <h6>Accessibility</h6>
              <p className="text-muted">
                <i className={`fas ${colorblindMode ? 'fa-check-circle text-success' : 'fa-times-circle'} me-2`}></i>
                {colorblindMode ? 'Enhanced Mode' : 'Standard Mode'}
              </p>
            </Col>
          </Row>
          <div className="mt-3 p-3 rounded" style={{ 
            background: colorblindMode 
              ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
              : (colorSchemes[theme]?.[colorScheme]?.gradient || 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)')
          }}>
            <p className="text-white mb-0 text-center">
              <strong>Preview:</strong> {colorblindMode ? 'Colorblind-friendly safe colors' : 'This is how your selected color scheme looks!'}
            </p>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .theme-card, .color-scheme-card {
          transition: all 0.3s ease;
        }
        
        .theme-card:hover, .color-scheme-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .theme-preview {
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #dee2e6;
        }
        
        .preview-header {
          height: 20px;
        }
        
        .preview-content {
          height: 60px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .preview-text {
          height: 8px;
          border-radius: 4px;
          opacity: 0.7;
        }
        
        .preview-text:first-child {
          width: 70%;
        }
        
        .preview-text:last-child {
          width: 50%;
        }
        
        .dark-preview .preview-content {
          background-color: #343a40;
        }
        
        .dark-preview .preview-text {
          background-color: #6c757d;
        }
      `}</style>
    </>
  );
};

export default AppearanceSettings;
