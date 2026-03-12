// server/src/middleware/validators.js
import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Middleware to check validation results and return errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

/**
 * Custom validator for MongoDB ObjectId
 */
const isValidObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

// ============================================
// USER ROUTE VALIDATORS
// ============================================

export const loginValidation = [
  body('emailOrUsername')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Email or username must be between 3 and 100 characters'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validate
];

export const signupValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('consent')
    .isObject()
    .withMessage('Consent object is required'),
  body('consent.ageConfirmed')
    .equals('true').withMessage('Age confirmation is required')
    .custom((value) => value === true || value === 'true')
    .withMessage('You must confirm you are 18 or older'),
  body('consent.agreedToTerms')
    .custom((value) => value === true || value === 'true')
    .withMessage('You must agree to the terms and conditions'),
  validate
];

export const updateUsernameValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  validate
];

export const updateEmailValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  validate
];

export const changePasswordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  validate
];

export const passwordResetRequestValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  validate
];

export const passwordResetValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  validate
];

// ============================================
// STORY ROUTE VALIDATORS
// ============================================

export const createStoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('story')
    .trim()
    .notEmpty()
    .withMessage('Story content is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Story must be between 10 and 5000 characters'),
  validate
];

export const updateStoryValidation = [
  param('id')
    .custom(isValidObjectId)
    .withMessage('Invalid story ID'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('story')
    .trim()
    .notEmpty()
    .withMessage('Story content is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Story must be between 10 and 5000 characters'),
  validate
];

export const deleteStoryValidation = [
  param('id')
    .custom(isValidObjectId)
    .withMessage('Invalid story ID'),
  validate
];

// ============================================
// FOLLOW ROUTE VALIDATORS
// ============================================

export const userIdParamValidation = [
  param('userId')
    .custom(isValidObjectId)
    .withMessage('Invalid user ID'),
  validate
];

export const fromUserIdParamValidation = [
  param('fromUserId')
    .custom(isValidObjectId)
    .withMessage('Invalid user ID'),
  validate
];

export const searchValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  validate
];

// ============================================
// NOTIFICATION ROUTE VALIDATORS
// ============================================

export const notificationIdValidation = [
  param('notificationId')
    .custom(isValidObjectId)
    .withMessage('Invalid notification ID'),
  validate
];
