import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouteError, Link } from "react-router-dom";
import "../styles/Error.css";

const ErrorPage = () => {
  const error = useRouteError();

  // Default error info
  const errorInfo = {
    status: error?.status || 500,
    statusText: error?.statusText || "Internal Server Error",
    message: error?.data || error?.message || "An unexpected error occurred",
  };

  // Get appropriate title and description based on error type
  const getErrorContent = (status) => {
    switch (status) {
      case 404:
        return {
          title: "Page Not Found",
          description:
            "The page you're looking for doesn't exist or has been moved.",
          emoji: "🔍",
        };
      case 403:
        return {
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          emoji: "🚫",
        };
      case 500:
        return {
          title: "Server Error",
          description:
            "Something went wrong on our end. Please try again later.",
          emoji: "⚠️",
        };
      default:
        return {
          title: "Something Went Wrong",
          description: "An unexpected error occurred. Please try again.",
          emoji: "❌",
        };
    }
  };

  const content = getErrorContent(errorInfo.status);
  return (
    <Container
      className="d-flex justify-content-center align-items-center error-container"
      style={{ minHeight: "100vh" }}
    >
      <Row className="text-center">
        <Col>
          <div
            className="error-emoji"
            style={{ fontSize: "4rem", marginBottom: "20px" }}
          >
            {content.emoji}
          </div>
          <h1
            className="error-title"
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {content.title}
          </h1>
          <p className="error-description">
            {content.description}
          </p>

          {/* Error details */}
          <div className="error-details">
            <p className="error-details-status">
              Error {errorInfo.status}:{" "}
              <strong className="error-details-status-text">
                {errorInfo.statusText}
              </strong>
            </p>
            {errorInfo.message &&
              errorInfo.message !== errorInfo.statusText && (
                <p className="error-details-message">
                  {errorInfo.message}
                </p>
              )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 error-buttons">
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="lg"
              className="error-button me-3"
            >
              🏠 Go Home
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              className="error-button"
              onClick={() => window.history.back()}
            >
              ↩️ Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
