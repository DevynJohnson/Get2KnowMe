// client/pages/ColorSchemeTest.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { applyColorScheme, colorSchemes } from '../constants/colorSchemes.js';

const ColorSchemeTest = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentColorScheme, setCurrentColorScheme] = useState('orange');
  const [cssVars, setCssVars] = useState({});

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorScheme = localStorage.getItem('colorScheme') || 'orange';
    setCurrentTheme(savedTheme);
    setCurrentColorScheme(savedColorScheme);
    
    // Update CSS variables display
    updateCssVars();
  }, []);

  const updateCssVars = () => {
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
  };

  const testColorScheme = (theme, colorScheme) => {
    console.log(`Testing ${theme} theme with ${colorScheme} color scheme`);
    applyColorScheme(theme, colorScheme, false, 'protanopia');
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    setCurrentTheme(theme);
    setCurrentColorScheme(colorScheme);
    setTimeout(updateCssVars, 100);
  };

  return (
    <Container className="py-4">
      <h2>Color Scheme Test Page</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Current Settings</Card.Header>
            <Card.Body>
              <p><strong>Theme:</strong> {currentTheme}</p>
              <p><strong>Color Scheme:</strong> {currentColorScheme}</p>
              <p><strong>localStorage theme:</strong> {localStorage.getItem('theme') || 'not set'}</p>
              <p><strong>localStorage colorScheme:</strong> {localStorage.getItem('colorScheme') || 'not set'}</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Current CSS Variables</Card.Header>
            <Card.Body style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {Object.entries(cssVars).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> <span style={{ color: value }}>{value || 'not set'}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Test Color Schemes</Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(colorSchemes).map(([theme, schemes]) => (
                  <Col key={theme} md={6}>
                    <h5>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</h5>
                    {Object.entries(schemes).map(([schemeKey, scheme]) => (
                      <Button
                        key={`${theme}-${schemeKey}`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2 mb-2"
                        onClick={() => testColorScheme(theme, schemeKey)}
                        style={{
                          borderColor: scheme.primary,
                          color: scheme.primary
                        }}
                      >
                        {scheme.name}
                      </Button>
                    ))}
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>Visual Test</Card.Header>
            <Card.Body>
              <Button className="btn-primary me-2 mb-2">Primary Button</Button>
              <Button className="btn-secondary me-2 mb-2">Secondary Button</Button>
              <Button className="btn-accent me-2 mb-2">Accent Button</Button>
              <div className="mt-3 p-3" style={{ background: 'var(--gradient-bg)', borderRadius: '5px' }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>Primary Gradient Background</span>
              </div>
              <div className="mt-2 p-3" style={{ background: 'var(--secondary-gradient)', borderRadius: '5px' }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>Secondary Gradient Background</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ColorSchemeTest;
