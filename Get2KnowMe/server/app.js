// server/src/app.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./src/routes/user-routes.js";
import passportRoutes from "./src/routes/passport-routes.js";
import storiesRoutes from "./src/routes/stories.js";
import followRoutes from "./src/routes/follow-routes.js";
import notificationRoutes from "./src/routes/notification-routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import winston from "winston";

// Define __filename and __dirname variables for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logger setup for GDPR audit trail - winston is a package that provides a simple and universal logging library
// It allows you to log messages with different severity levels (info, warn, error) and supports multiple transports (e.g., console, file).
// This logger will log all messages to a file and optionally to the console in development mode.
// It also formats the logs with timestamps and JSON for better readability and analysis.
// The logger is used to track data operations for GDPR compliance, logging method, path, IP address, user agent, timestamp, and user ID.
// This is useful for tracking changes to user data and ensuring compliance with GDPR regulations.
// The logs are stored in the 'logs' directory, with separate files for errors and combined logs.

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console()]
      : []),
  ],
});

// Trust proxy to handle forwarded headers correctly in production, this helps with correct IP logging and security headers.
app.set("trust proxy", 1);

// Security middleware with helmet to set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      // Use a strict CSP to prevent XSS attacks, this helps mitigate risks from malicious scripts by restricting sources of content
      directives: {
        defaultSrc: ["'self'"], // Default source is self to prevent loading resources from other origins
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://stackpath.bootstrapcdn.com",
          "https://cdn.jsdelivr.net",
          "https://stackpath.bootstrapcdn.com",
          "https://fonts.googleapis.com",
          "https://use.fontawesome.com",
        ], // Allow styles from trusted CDNs and self
        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.gstatic.com",
          "https://use.fontawesome.com",
        ], // Allow fonts from trusted sources
        imgSrc: ["'self'", "data:", "https:"], // Allow images from self, data URIs, and HTTPS sources
        scriptSrc: ["'self'"], // Allow scripts from self, this prevents loading scripts from untrusted sources
      },
    },
  })
);

// Rate limiting - this helps prevent abuse by limiting the number of requests from a single IP address
// It helps protect against brute force attacks and denial of service attacks by limiting the number of requests
// This is especially important for authentication endpoints to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication routes
// This limits login attempts to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // login attempts per windowMs
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // This excludes successful login attempts from the rate limit, this helps to prevent locking out users who successfully log in
});

app.use(limiter);
app.use("/api/users", authLimiter); // Applied to your user routes to protect login and signup endpoints
app.use("/api/passport", authLimiter); // Applied to your passport routes to protect communication passport endpoints

app.use(compression());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// GDPR audit logging middleware - logs all data operations that modify data. This is useful for tracking changes to user data.
// It logs the method, path, IP address, user agent, timestamp, and user ID
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    logger.info("Data operation", {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
      userId: req.user?.id || "anonymous",
    });
  }
  next();
});

// Body parsing middleware with size limits to prevent large payloads that could lead to denial of service attacks which aim to overwhelm the server with large requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration for both production and development environments
// This allows requests from specific origins in production and all origins in development
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN
        ? [process.env.CORS_ORIGIN]
        : true
      : [
          "https://get2knowme.co.uk",
          "https://get2know.me",
          "https://get2knowme.onrender.com",
          "http://localhost:5173",
        ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// API Routes for user data
app.use("/api/users", userRoutes);
app.use("/api/passport", passportRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notifications", notificationRoutes);

// Static file serving for production
// This serves the React app built files from the dist directory
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

// Export both app and logger
export { logger };
export default app;
