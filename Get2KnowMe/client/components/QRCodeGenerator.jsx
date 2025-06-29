// client/components/QRCodeGenerator.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Card, Alert, Spinner } from "react-bootstrap";
import QRCode from "qrcode";
import "../styles/QRCodeGenerator.css";

const QRCodeGenerator = ({ show, onHide, passcode, passportName }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateQRCode = useCallback(async () => {
    setIsGenerating(true);
    setError("");

    try {
      // Create the full URL to the passport
      const baseURL = window.location.origin;
      const passportURL = `${baseURL}/passport/view/${passcode}`;

      // Generate QR code with high error correction for better scanning
      const qrOptions = {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.92,
        margin: 2,
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      };

      const qrDataURL = await QRCode.toDataURL(passportURL, qrOptions);
      setQrCodeDataURL(qrDataURL);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [passcode]);

  // Generate the QR code when the modal opens
  useEffect(() => {
    if (show && passcode) {
      generateQRCode();
    }
  }, [show, passcode, generateQRCode]);

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement("a");
    link.download = `${passportName || "communication-passport"}-qr-code.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    if (!qrCodeDataURL) return;

    const printWindow = window.open("", "_blank");
    const passportURL = `${window.location.origin}/passport/view/${passcode}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Communication Passport QR Code - ${passportName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              margin: 20px auto;
              max-width: 400px;
            }
            .qr-code {
              max-width: 100%;
              height: auto;
              border: 2px solid #ddd;
              border-radius: 8px;
            }
            .info {
              margin: 20px 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #e9ecef;
            }
            .passcode {
              font-family: monospace;
              font-size: 1.2em;
              font-weight: bold;
              color: #007bff;
            }
            .url {
              font-size: 0.9em;
              color: #666;
              word-break: break-all;
            }
            .instructions {
              margin-top: 20px;
              padding: 15px;
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              color: #856404;
            }
            @media print {
              body { padding: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Communication Passport QR Code</h2>
            ${passportName ? `<h3>${passportName}</h3>` : ""}
            
            <img src="${qrCodeDataURL}" alt="QR Code for Communication Passport" class="qr-code" />
            
            <div class="info">
              <p><strong>Passcode:</strong> <span class="passcode">${passcode}</span></p>
              <p class="url">${passportURL}</p>
            </div>
            
            <div class="instructions">
              <p><strong>How to use:</strong></p>
              <p>• Scan this QR code with any smartphone camera</p>
              <p>• Or manually enter the passcode at get2knowme.com</p>
              <p>• Access communication preferences and trusted contact info</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const copyToClipboard = async () => {
    const passportURL = `${window.location.origin}/passport/view/${passcode}`;
    try {
      await navigator.clipboard.writeText(passportURL);
      // You could add a toast notification here
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = passportURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-qrcode me-2"></i>
          Communication Passport QR Code
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {isGenerating ? (
          <div className="py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Generating QR code...</p>
          </div>
        ) : qrCodeDataURL ? (
          <div>
            <Card className="mb-3">
              <Card.Body className="p-4">
                {passportName && (
                  <h5 className="mb-3 text-primary">{passportName}</h5>
                )}

                <div className="qr-code-container mb-3">
                  <img
                    src={qrCodeDataURL}
                    alt="QR Code for Communication Passport"
                    className="img-fluid"
                    style={{
                      maxWidth: "250px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className="passport-info">
                  <p className="mb-2">
                    <strong>Passcode:</strong>
                    <span className="ms-2 badge bg-primary fs-6">
                      {passcode}
                    </span>
                  </p>
                  <p className="text-muted small mb-0">
                    {window.location.origin}/passport/view/{passcode}
                  </p>
                </div>
              </Card.Body>
            </Card>

            <Alert variant="info" className="text-start">
              <Alert.Heading className="h6">
                <i className="fas fa-info-circle me-2"></i>
                How to Use
              </Alert.Heading>
              <ul className="mb-0 small">
                <li>
                  Anyone can scan this QR code with their smartphone camera
                </li>
                <li>The code links directly to your Communication Passport</li>
                <li>
                  Perfect for emergency situations or when meeting new people
                </li>
                <li>You can also share the passcode manually if needed</li>
              </ul>
            </Alert>
          </div>
        ) : null}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button variant="outline-secondary" onClick={onHide}>
            Close
          </Button>
        </div>

        {qrCodeDataURL && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={copyToClipboard}
              title="Copy link to clipboard"
            >
              <i className="fas fa-copy me-1"></i>
              Copy Link
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={downloadQRCode}
              title="Download QR code as PNG"
            >
              <i className="fas fa-download me-1"></i>
              Download
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={printQRCode}
              title="Print QR code"
            >
              <i className="fas fa-print me-1"></i>
              Print
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodeGenerator;
