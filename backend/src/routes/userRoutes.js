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

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/profile', uploadProfileImageMiddleware, updateProfile);
router.post('/profile/upload-image', uploadProfileImageMiddleware, uploadProfileImage);
router.put('/onboarding', updateOnboarding);

export default router;

