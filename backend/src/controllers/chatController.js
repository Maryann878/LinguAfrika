import { ChatMessage } from '../models/Chat.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const limit = parseInt(req.query.limit) || 50;

  const messages = await ChatMessage.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

export const createChatMessage = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { message, language } = req.body;

  // Create user message
  const userMessage = await ChatMessage.create({
    userId,
    message,
    language,
    messageType: 'user',
  });

  // TODO: Integrate with AI service (OpenAI, etc.)
  // For now, return a simple response
  const aiResponse = `I understand you're learning ${language || 'a language'}. Let's practice! Can you try using "${message}" in a sentence?`;

  const aiMessage = await ChatMessage.create({
    userId,
    message: aiResponse,
    response: aiResponse,
    language,
    messageType: 'ai',
  });

  res.status(201).json({
    success: true,
    data: {
      userMessage,
      aiMessage,
    },
  });
});


