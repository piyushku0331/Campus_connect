const rateLimit = require('express-rate-limit');
const logger = require('../config/winston');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // eslint-disable-next-line no-unused-vars
  handler: (req, res, next) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks or admin routes
    return req.path === '/health' || req.path.startsWith('/api/admin');
  }
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  // eslint-disable-next-line no-unused-vars
  handler: (req, res, next) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: 900
    });
  }
});

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Upload limit exceeded, please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  // eslint-disable-next-line no-unused-vars
  handler: (req, res, next) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Upload limit exceeded, please try again later.',
      retryAfter: 3600
    });
  }
});

// Rate limiter for search endpoints
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 searches per minute
  message: {
    success: false,
    message: 'Too many search requests, please slow down.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // eslint-disable-next-line no-unused-vars
  handler: (req, res, next) => {
    logger.warn(`Search rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many search requests, please slow down.',
      retryAfter: 60
    });
  }
});

// Create custom rate limiter function
const createCustomLimiter = (options) => {
  return rateLimit({
    windowMs: (options.windowMs || 15) * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      message: options.message || 'Rate limit exceeded',
      retryAfter: Math.ceil(((options.windowMs || 15) * 60 * 1000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // eslint-disable-next-line no-unused-vars
    handler: (req, res, next) => {
      logger.warn(`${options.name || 'Custom'} rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
      res.status(options.statusCode || 429).json({
        success: false,
        message: options.message || 'Rate limit exceeded',
        retryAfter: Math.ceil(((options.windowMs || 15) * 60 * 1000) / 1000)
      });
    },
    skip: options.skip || (() => false)
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  searchLimiter,
  createCustomLimiter
};