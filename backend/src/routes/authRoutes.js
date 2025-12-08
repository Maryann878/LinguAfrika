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

const router = Router();

router.post('/signup', validate(validateSignup), signup);
router.post('/login', validate(validateLogin), login);
router.post('/verify', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.post('/forgot-password', validate(validateResetPassword), forgotPassword);
router.post('/verify-password-reset-otp', verifyPasswordResetOTP);
router.post('/resend-password-reset-otp', validate(validateResetPassword), resendPasswordResetOTP);
router.post('/reset-password', validate(validateNewPassword), resetPassword);
router.get('/me', authenticate, getMe);

export default router;

