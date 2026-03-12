/**
 * WAF (Web Application Firewall) Middleware
 * Blocks malicious requests for PHP files, common vulnerability scanners, and suspicious patterns
 */

import winston from "winston";

const WAF_WINDOW_MS = 5 * 60 * 1000;
const WAF_BAN_THRESHOLD = 10;
const WAF_BAN_DURATION_MS = 60 * 60 * 1000;

const wafIpState = new Map();

// Logger for security events
const securityLogger = winston.createLogger({
  level: "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/security.log", level: "warn" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

const blockedPathPatterns = {
  php: /\.php(?:\?|$|\/)/i,
  php3: /\.php3(?:\?|$|\/)/i,
  php4: /\.php4(?:\?|$|\/)/i,
  php5: /\.php5(?:\?|$|\/)/i,
  phtml: /\.phtml(?:\?|$|\/)/i,
  wordpress: /\/(?:wp-admin|wp-login(?:\.php)?|wp-config\.php|wp-content|wp-includes)(?:\/|$|\?)/i,
  cmsAdmin: /\/(?:administrator|admin\.php|config\.php|index\.php)(?:\/|$|\?)/i,
  sensitiveFiles: /\/(?:\.env(?:\.[^/?]+)?|\.git|\.svn)(?:\/|$|\?)/i,
  phpMyAdmin: /\/(?:phpmyadmin|pma)(?:\/|$|\?)/i,
  xmlrpc: /\/xmlrpc\.php(?:$|\?)/i,
};

const traversalPattern = /(?:\.\.[/\\]|%2e%2e%2f|%2e%2e%5c)/i;

const cleanupIpState = (now) => {
  for (const [ip, state] of wafIpState.entries()) {
    if (state.blockedUntil <= now && state.hits.length === 0) {
      wafIpState.delete(ip);
    }
  }
};

const getIpState = (ip, now) => {
  const state = wafIpState.get(ip) || { hits: [], blockedUntil: 0 };
  state.hits = state.hits.filter((timestamp) => now - timestamp < WAF_WINDOW_MS);

  if (state.blockedUntil <= now && state.hits.length === 0) {
    wafIpState.delete(ip);
    return { hits: [], blockedUntil: 0 };
  }

  wafIpState.set(ip, state);
  return state;
};

const logBlockedRequest = (reason, req, now) => {
  securityLogger.warn("WAF: Blocked suspicious request", {
    reason,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date(now).toISOString(),
  });
};

const blockRequest = (res, statusCode, message) =>
  res.status(statusCode).json({
    error: "Forbidden",
    message,
  });

const getBlockReason = (requestTarget) => {
  for (const [reason, pattern] of Object.entries(blockedPathPatterns)) {
    if (pattern.test(requestTarget)) {
      return reason;
    }
  }

  if (traversalPattern.test(requestTarget)) {
    return "traversal";
  }

  return null;
};

/**
 * WAF Middleware Function
 * Analyzes incoming requests and blocks suspicious ones
 */
export const wafMiddleware = (req, res, next) => {
  const now = Date.now();
  cleanupIpState(now);

  const state = getIpState(req.ip, now);
  if (state.blockedUntil > now) {
    logBlockedRequest("temporary-ban", req, now);
    return blockRequest(
      res,
      429,
      "Too many suspicious requests from this IP. Please try again later."
    );
  }

  const reason = getBlockReason(req.originalUrl);
  if (reason) {
    state.hits.push(now);
    if (state.hits.length >= WAF_BAN_THRESHOLD) {
      state.blockedUntil = now + WAF_BAN_DURATION_MS;
      state.hits = [];
    }
    wafIpState.set(req.ip, state);

    logBlockedRequest(reason, req, now);
    return blockRequest(
      res,
      403,
      "Your request has been blocked by our security system."
    );
  }

  next();
};

export default wafMiddleware;
