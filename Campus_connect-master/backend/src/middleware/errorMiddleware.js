const logger = require('../utils/logger');
const errorHandler = (err, req, res) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.code === 'PGRST116') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorResponse = {
    error: message,
    ...(isDevelopment && { stack: err.stack })
  };
  res.status(statusCode).json(errorResponse);
};
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: 'Too many requests',
    message: 'Please try again later'
  });
};
module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  rateLimitHandler
};
