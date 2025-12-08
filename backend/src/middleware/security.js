import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * Security middleware configuration
 * Applies multiple security layers to protect the application
 */

/**
 * Helmet.js configuration for security headers
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Socket.IO compatibility
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // X-Frame-Options
  frameguard: { action: 'deny' },
  // X-Content-Type-Options
  noSniff: true,
  // X-XSS-Protection
  xssFilter: true,
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Permissions Policy
  permissionsPolicy: {
    features: {
      geolocation: ["'self'"],
      microphone: ["'self'"],
      camera: ["'self'"],
    },
  },
});

/**
 * MongoDB injection protection
 * Sanitizes user input to prevent NoSQL injection attacks
 */
export const mongoSanitization = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security] Sanitized NoSQL injection attempt on key: ${key}`);
  },
});

/**
 * HTTP Parameter Pollution protection
 * Prevents parameter pollution attacks
 */
export const parameterPollutionProtection = hpp({
  whitelist: [
    'filter',
    'sort',
    'page',
    'limit',
    'fields',
  ],
});

/**
 * Request size limits
 * Prevents DoS attacks through large payloads
 */
export const requestSizeLimits = (req, res, next) => {
  // Set maximum request body size (already handled by express.json, but adding explicit check)
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = req.get('content-length');
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Maximum size is 10MB.',
    });
  }
  
  next();
};

/**
 * Input sanitization for common XSS patterns
 */
export const inputSanitization = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove potentially dangerous patterns
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof value === 'object') {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body && Object.keys(req.body).length > 0) {
    req.body = sanitize(req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    req.query = sanitize(req.query);
  }
  if (req.params && Object.keys(req.params).length > 0) {
    req.params = sanitize(req.params);
  }

  next();
};

