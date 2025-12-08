import { Router } from 'express';
import {
  getQuizById,
  getQuizzesByCourse,
  getQuizzesByLesson,
  submitQuiz,
  getQuizResults,
  getQuizAttempts,
  getAllUserQuizAttempts,
  getUserQuizStats,
} from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes (no auth required)
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/lesson/:lessonId', getQuizzesByLesson);
router.get('/:id', getQuizById);

// Protected routes (require authentication)
router.use(authenticate);

router.post('/:id/submit', submitQuiz);
router.get('/:attemptId/results', getQuizResults);
router.get('/:quizId/attempts', getQuizAttempts);
router.get('/user/attempts', getAllUserQuizAttempts);
router.get('/user/stats', getUserQuizStats);

export default router;

