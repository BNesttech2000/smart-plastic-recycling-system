// server/src/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// Validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters')
];

const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

const validateContribution = [
  body('plasticType')
    .notEmpty().withMessage('Plastic type is required')
    .isIn(['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']).withMessage('Invalid plastic type'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ min: 0.1 }).withMessage('Quantity must be at least 0.1 kg')
    .toFloat(),
  
  body('collectionPoint')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Collection point cannot exceed 100 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

const validateIncentive = [
  body('rewardType')
    .notEmpty().withMessage('Reward type is required')
    .isIn(['POINTS', 'VOUCHER', 'CASH', 'OTHER']).withMessage('Invalid reward type'),
  
  body('rewardValue')
    .notEmpty().withMessage('Reward value is required')
    .isFloat({ min: 0 }).withMessage('Reward value must be a positive number')
];

// Validation result checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateContribution,
  validateIncentive,
  validate
};