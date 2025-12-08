import { Router } from 'express';
import {
  updateProfile,
  getUserById,
  getAllUsers,
  updateOnboarding,
  uploadProfileImage,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadProfileImageMiddleware } from '../utils/upload.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';
import { validate, validateProfileUpdate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate); // All routes require authentication

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File too large. Maximum size is 5MB.', 400));
    }
    if (err.message && err.message.includes('Only image files')) {
      return next(new AppError(err.message, 400));
    }
    return next(new AppError(err.message || 'File upload error', 400));
  }
  next();
};

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', validate(validateProfileUpdate), uploadProfileImageMiddleware, handleMulterError, updateProfile);
router.post('/profile/upload-image', uploadProfileImageMiddleware, handleMulterError, uploadProfileImage);
router.put('/onboarding', validate(validateProfileUpdate), updateOnboarding);

export default router;

