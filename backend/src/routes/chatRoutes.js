import { Router } from 'express';
import {
  getChatHistory,
  createChatMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/history', getChatHistory);
router.post('/message', chatLimiter, createChatMessage); // Apply rate limiting to chat messages

export default router;


