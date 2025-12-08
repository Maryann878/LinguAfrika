import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const errorMessages = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      }));

      const firstError = errorMessages[0];
      throw new AppError(firstError?.message || 'Validation failed', 400);
    } catch (error) {
      next(error);
    }
  };
};

// Validation rules
export const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(), // HTML escape
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  body('mobile')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Mobile number must be between 10 and 15 characters')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid mobile number')
    .escape(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom((value) => {
      // Check for common weak passwords
      const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
      if (commonPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password.');
      }
      return true;
    }),
];

export const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required')
    .isLength({ max: 255 })
    .withMessage('Identifier must not exceed 255 characters')
    .escape(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password must not exceed 128 characters'),
];

export const validateResetPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
];

export const validateNewPassword = [
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom((value) => {
      // Check for common weak passwords
      const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
      if (commonPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password.');
      }
      return true;
    }),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Additional validation rules for profile updates
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters')
    .escape(),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters')
    .escape(),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters')
    .escape(),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('ageRange')
    .optional()
    .isIn(['13-17', '18-24', '25-34', '35-44', '45+'])
    .withMessage('Age range must be one of the allowed values'),
];

// Validation for OTP/verification codes
export const validateOTP = [
  body('code')
    .trim()
    .isLength({ min: 4, max: 6 })
    .withMessage('Verification code must be between 4 and 6 characters')
    .matches(/^[0-9]+$/)
    .withMessage('Verification code must contain only numbers'),
];

