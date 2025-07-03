// client/components/QRCodeScanner.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRCodeScanner = ({ show, onHide, onScanSuccess }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const readerRef = useRef(null);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    console.log('startScanning called, videoRef.current:', videoRef.current);
    setIsLoading(true);
    setError('');
    setScanning(false);

    try {
      // Check if camera permission is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Check if video element exists (with retry logic)
      if (!videoRef.current) {
        console.log('Video element not found, waiting...');
        // Try waiting a bit for the element to render
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (!videoRef.current) {
          setError('Video element not found');
          setIsLoading(false);
          return;
        }
      }

      console.log('Video element found, initializing scanner...');
      
      // Initialize the QR code reader
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      // Let ZXing handle the entire camera setup
      setScanning(true);
      setHasPermission(true);
      setIsLoading(false);
      
      reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          const text = result.getText();
          console.log('QR Code scanned:', text);
          
          // Extract passcode from URL or use text directly
          let passcode = text;
          const urlMatch = text.match(/\/passport\/view\/([^/?]+)/);
          if (urlMatch) {
            passcode = urlMatch[1];
          }
          
          // Call success callback
          onScanSuccess(passcode);
          stopScanning();
          onHide();
        }
        
        if (error && error.name !== 'NotFoundException') {
          console.warn('QR Code scan error:', error);
        }
      });

    } catch (err) {
      console.error('Error starting camera:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera permission was denied. Please allow camera access and try again.');
        setHasPermission(false);
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotSupportedError') {
        setError('Camera access is not supported in this browser.');
      } else {
        setError(`Failed to access camera: ${err.message}`);
      }
      setIsLoading(false);
    }
  }, [onScanSuccess, onHide, stopScanning]);

  useEffect(() => {
    // Cleanup when modal closes
    if (!show) {
      stopScanning();
    } else {
      // Start scanning when modal opens (with delay for rendering)
      const timer = setTimeout(() => {
        startScanning();
      }, 300);
      
      return () => clearTimeout(timer);
    }

    return () => {
      stopScanning();
    };
  }, [show, startScanning, stopScanning]);

  const handleRetry = () => {
    startScanning();
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-camera me-2"></i>
          Scan QR Code
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center">
        {error && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading className="h6">Camera Error</Alert.Heading>
            <p className="mb-2">{error}</p>
            {hasPermission === false && (
              <div className="small">
                <p className="mb-1"><strong>To enable camera access:</strong></p>
                <ul className="text-start mb-0">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera permissions</li>
                  <li>Refresh the page if needed</li>
                </ul>
              </div>
            )}
          </Alert>
        )}

        {isLoading && (
          <div className="py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Starting camera...</p>
          </div>
        )}

        {/* Always render video element when modal is open - even when loading */}
        {show && !error && (
          <div>
            <div className="camera-container mb-3" style={{ position: 'relative' }}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  minHeight: '300px',
                  border: '2px solid #007bff',
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  display: 'block',
                  opacity: isLoading ? 0.5 : 1
                }}
                autoPlay
                playsInline
                muted
                controls={false}
              />
              {scanning && (
                <div 
                  className="scan-overlay"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    height: '60%',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
            
            {scanning && (
              <Alert variant="info" className="text-start">
                <Alert.Heading className="h6">
                  <i className="fas fa-info-circle me-2"></i>
                  Scanning Instructions
                </Alert.Heading>
                <ul className="mb-0 small">
                  <li>Point your camera at a Communication Passport QR code</li>
                  <li>Keep the QR code within the green square</li>
                  <li>Hold steady until the code is detected</li>
                  <li>Make sure there's good lighting</li>
                </ul>
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        
        {error && (
          <Button variant="primary" onClick={handleRetry} className="btn-primary">
            <i className="fas fa-redo me-1"></i>
            Try Again
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodeScanner;
