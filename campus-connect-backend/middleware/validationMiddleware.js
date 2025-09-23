const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['student', 'admin', 'faculty'])
    .withMessage('Role must be student, admin, or faculty'),

  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Event validation rules
const validateEventCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),

  body('campus')
    .trim()
    .notEmpty()
    .withMessage('Campus is required'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  handleValidationErrors
];

// Placement validation rules
const validatePlacementCreation = [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),

  body('jobTitle')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),

  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid deadline date'),

  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number'),

  handleValidationErrors
];

// Notice validation rules
const validateNoticeCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),

  body('targetAudience')
    .optional()
    .isIn(['all', 'students', 'faculty', 'admin'])
    .withMessage('Target audience must be all, students, faculty, or admin'),

  handleValidationErrors
];

// Study material validation rules
const validateMaterialCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),

  body('course')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Course must be less than 100 characters'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),

  handleValidationErrors
];

// Lost item validation rules
const validateLostItemCreation = [
  body('itemName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('contactInfo')
    .trim()
    .notEmpty()
    .withMessage('Contact information is required'),

  body('itemType')
    .isIn(['lost', 'found'])
    .withMessage('Item type must be either lost or found'),

  handleValidationErrors
];

// Helpline validation rules
const validateHelplineCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact information is required'),

  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('Service type is required'),

  body('availability')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Availability must be less than 200 characters'),

  handleValidationErrors
];

// Post validation rules
const validatePostCreation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  handleValidationErrors
];

// Generic ID validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateEventCreation,
  validatePlacementCreation,
  validateNoticeCreation,
  validateMaterialCreation,
  validateLostItemCreation,
  validateHelplineCreation,
  validatePostCreation,
  validateObjectId,
  validatePagination,
  handleValidationErrors
};