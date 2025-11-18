const logger = require('./logger');

/**
 * Handles errors in controllers by logging and sending appropriate response
 * @param {Error} error - The error object
 * @param {string} action - Description of the action that failed
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleControllerError = (error, action, res, statusCode = 500) => {
  logger.error(`Error ${action}:`, error);
  res.status(statusCode).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * Handles validation errors
 * @param {Error} error - Validation error
 * @param {Object} res - Express response object
 */
const handleValidationError = (error, res) => {
  logger.error('Validation error:', error);
  res.status(400).json({
    error: 'Validation failed',
    details: error.details || error.message
  });
};

module.exports = {
  handleControllerError,
  handleValidationError
};