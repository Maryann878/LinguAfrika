import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/errorHandler.js';

/**
 * General API rate limiter - applies to all routes
 * Safe defaults that won't break normal usage
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    throw new AppError('Too many requests from this IP, please try again later.', 429);
  },
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new AppError('Too many login attempts, please try again after 15 minutes.', 429);
  },
});

/**
 * Rate limiter for password reset requests
 * Prevents abuse of password reset functionality
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new AppError('Too many password reset attempts, please try again after 1 hour.', 429);
  },
});

/**
 * Rate limiter for email verification requests
 */
export const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 verification requests per 15 minutes
  message: {
    success: false,
    message: 'Too many verification requests, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new AppError('Too many verification requests, please try again after 15 minutes.', 429);
  },
});

/**
 * Rate limiter for chat/AI requests
 * Prevents abuse of AI features
 */
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat messages per minute
  message: {
    success: false,
    message: 'Too many chat requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new AppError('Too many chat requests, please slow down.', 429);
  },
});

