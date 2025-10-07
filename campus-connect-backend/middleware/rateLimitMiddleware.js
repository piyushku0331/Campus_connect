const rateLimit = require('express-rate-limit');
const logger = require('../config/winston');


const apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, 
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
  },
  standardHeaders: true, 
  legacyHeaders: false, 
  
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(((process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000) / 1000)
    });
  },
  skip: (req) => {
    
    return req.path === '/health' || req.path.startsWith('/api/admin');
  }
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: 900
    });
  }
});


const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Upload limit exceeded, please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Upload limit exceeded, please try again later.',
      retryAfter: 3600
    });
  }
});


const searchLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30, 
  message: {
    success: false,
    message: 'Too many search requests, please slow down.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    logger.warn(`Search rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many search requests, please slow down.',
      retryAfter: 60
    });
  }
});


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
    
    handler: (req, res) => {
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