const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const { config } = require('../config');
    console.log('Verifying token:', token.substring(0, 20) + '...'); // Debug log
    console.log('Using JWT secret:', config.jwt.secret.substring(0, 10) + '...'); // Debug log
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log('Decoded token:', decoded); // Debug log
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for ID:', decoded.userId); // Debug log
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (!user.email?.endsWith('@chitkara.edu.in')) {
      return res.status(403).json({ error: 'Access denied. Only @chitkara.edu.in emails allowed.' });
    }
    req.user = user;
    req.userId = decoded.userId;
    console.log('Token verification successful for user:', user.email); // Debug log
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Internal server error during token verification' });
  }
};
const requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};
const handleFileUpload = (fieldName, allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    next();
  };
};
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    const userRequests = requests.get(key);
    const validRequests = userRequests.filter(time => time > windowStart);
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }
    validRequests.push(now);
    requests.set(key, validRequests);
    next();
  };
};
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};
const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error);
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack })
  });
};
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
module.exports = {
  verifyToken,
  requireAdmin,
  validateRequest,
  handleFileUpload,
  rateLimit,
  requestLogger,
  errorHandler,
  corsOptions
};
