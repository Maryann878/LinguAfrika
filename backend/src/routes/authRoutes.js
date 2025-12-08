import { Router } from 'express';
import {
  signup,
  login,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyPasswordResetOTP,
  resendPasswordResetOTP,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateSignup,
  validateLogin,
  validateResetPassword,
  validateNewPassword,
  validate,
} from '../middleware/validate.js';
import { 
  authLimiter, 
  passwordResetLimiter, 
  emailVerificationLimiter 
} from '../middleware/rateLimiter.js';

const router = Router();

// Apply strict rate limiting to authentication routes
router.post('/signup', authLimiter, validate(validateSignup), signup);
router.post('/login', authLimiter, validate(validateLogin), login);
router.post('/verify', emailVerificationLimiter, verifyEmail);
router.post('/resend-verification', emailVerificationLimiter, resendVerificationCode);
router.post('/forgot-password', passwordResetLimiter, validate(validateResetPassword), forgotPassword);
router.post('/verify-password-reset-otp', passwordResetLimiter, verifyPasswordResetOTP);
router.post('/resend-password-reset-otp', passwordResetLimiter, validate(validateResetPassword), resendPasswordResetOTP);
router.post('/reset-password', passwordResetLimiter, validate(validateNewPassword), resetPassword);
router.get('/me', authenticate, getMe);

export default router;

