const { body, param, query, validationResult } = require('express-validator');

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

const validateEventCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('start_date')
    .isISO8601()
    .withMessage('Please provide a valid start date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event start date cannot be in the past');
      }
      return true;
    }),

  body('end_date')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

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

const validatePlacementCreation = [
  body('studentName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Student name must be between 2 and 100 characters'),

  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),

  body('role')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role must be between 2 and 100 characters'),

  body('year')
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),

  handleValidationErrors
];

const validateNoticeCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('category')
    .isIn(['Exams', 'Results', 'Scholarships', 'General'])
    .withMessage('Category must be Exams, Results, Scholarships, or General'),

  handleValidationErrors
];

const validateMaterialCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),

  body('semester')
    .trim()
    .notEmpty()
    .withMessage('Semester is required'),

  body('university')
    .trim()
    .notEmpty()
    .withMessage('University is required'),

  handleValidationErrors
];

const validateLostItemCreation = [
  body('itemName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('category')
    .optional()
    .isIn(['Electronics', 'Documents', 'Books', 'Clothing', 'Personal Items', 'Other'])
    .withMessage('Invalid category'),

  body('status')
    .optional()
    .isIn(['Lost', 'Found'])
    .withMessage('Status must be Lost or Found'),

  handleValidationErrors
];

const validateHelplineCreation = [
  body('serviceName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('category')
    .isIn(['Medical', 'Security', 'Transport', 'General'])
    .withMessage('Category must be Medical, Security, Transport, or General'),

  handleValidationErrors
];

const validatePostCreation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),

  body('type')
    .optional()
    .isIn(['text', 'image', 'video', 'link'])
    .withMessage('Type must be text, image, video, or link'),

  handleValidationErrors
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  handleValidationErrors
];

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