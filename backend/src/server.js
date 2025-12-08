import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { errorHandler } from './utils/errorHandler.js';
import { initializeSocket } from './socket/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);
global.io = io;

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LinguAfrika API is running',
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  console.log('Test endpoint called:', req.body);
  res.json({ success: true, received: req.body });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  httpServer.close(() => {
    process.exit(1);
  });
});

// Start server only after DB connection
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log('✅ Database connected successfully');

    // Ensure demo account exists on startup (only if flag is not set to false)
    if (process.env.ENSURE_DEMO_ACCOUNT !== 'false') {
      // Run asynchronously so it doesn't block server startup
      import('./scripts/ensureDemoAccount.js').then(module => {
        module.ensureDemoAccount().catch(err => {
          console.log('⚠️ Could not ensure demo account:', err.message);
        });
      }).catch(err => {
        console.log('⚠️ Could not load ensure demo account script:', err.message);
      });
    }

    // Start server only after DB is connected
    const PORT = config.port;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.IO initialized`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

