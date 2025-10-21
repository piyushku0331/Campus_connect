const { body, param, query, validationResult } = require('express-validator');
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};
const validateUserProfile = [
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  body('major')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Major must not exceed 255 characters'),
  body('year')
    .optional()
    .isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'])
    .withMessage('Invalid year value'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  handleValidationErrors
];
const validateUserSearch = [
  query('query')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Search query must not be empty'),
  query('major')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Major must not be empty'),
  query('year')
    .optional()
    .isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'])
    .withMessage('Invalid year value'),
  handleValidationErrors
];
const validateEvent = [
  body('title')
    .notEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must not exceed 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('location')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('start_date')
    .notEmpty()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('end_date')
    .notEmpty()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('max_attendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attendees must be a positive integer'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  handleValidationErrors
];
const validateEventId = [
  param('id')
    .isUUID()
    .withMessage('Invalid event ID'),
  handleValidationErrors
];
const validateRSVP = [
  body('status')
    .notEmpty()
    .isIn(['attending', 'interested', 'not_attending'])
    .withMessage('Status must be attending, interested, or not_attending'),
  handleValidationErrors
];
const validateConnectionRequest = [
  body('receiver_id')
    .notEmpty()
    .isUUID()
    .withMessage('Receiver ID must be a valid UUID'),
  handleValidationErrors
];
const validateConnectionId = [
  param('id')
    .isUUID()
    .withMessage('Invalid connection ID'),
  handleValidationErrors
];
const validateResource = [
  body('title')
    .notEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must not exceed 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('file_url')
    .notEmpty()
    .isURL()
    .withMessage('File URL is required and must be a valid URL'),
  body('file_type')
    .optional()
    .isLength({ max: 50 })
    .withMessage('File type must not exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  handleValidationErrors
];
const validateResourceId = [
  param('id')
    .isUUID()
    .withMessage('Invalid resource ID'),
  handleValidationErrors
];
const validateResourceSearch = [
  query('query')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Search query must not be empty'),
  query('tag')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Tag must not be empty'),
  handleValidationErrors
];
module.exports = {
  validateUserProfile,
  validateUserSearch,
  validateEvent,
  validateEventId,
  validateRSVP,
  validateConnectionRequest,
  validateConnectionId,
  validateResource,
  validateResourceId,
  validateResourceSearch,
  handleValidationErrors
};
