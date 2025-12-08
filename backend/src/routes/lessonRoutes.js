import { Router } from 'express';
import {
  getLessonsByCourse,
  getLessonById,
  getLevelsByCourse,
} from '../controllers/lessonController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/course/:courseId', getLessonsByCourse);
router.get('/course/:courseId/levels', getLevelsByCourse);
router.get('/:id', getLessonById);

export default router;


