import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  getCourseByName,
  getLanguages,
  getCoursesByLanguage,
  getCoursesByLevel,
  getUserProgress,
  getAllUserProgress,
  updateProgress,
} from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/languages', getLanguages);
router.get('/language/:language', getCoursesByLanguage);
router.get('/level/:level', getCoursesByLevel);
router.get('/name/:name', getCourseByName);
router.get('/:id', getCourseById);

// Protected routes (require authentication)
router.get('/progress/all', authenticate, getAllUserProgress);
router.get('/:courseId/progress', authenticate, getUserProgress);
router.put('/:courseId/progress', authenticate, updateProgress);

export default router;

