import { Router } from 'express';
import {
  getChatHistory,
  createChatMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/history', getChatHistory);
router.post('/message', createChatMessage);

export default router;


