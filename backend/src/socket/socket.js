import { Server as SocketServer } from 'socket.io';
import { verifyToken } from '../utils/generateToken.js';
import { User } from '../models/User.js';

const connectedUsers = new Map();

export const initializeSocket = (httpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('username');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = decoded.userId;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const username = socket.username;

    // Store connected user
    connectedUsers.set(userId, {
      userId,
      socketId: socket.id,
      username,
    });

    console.log(`✅ User connected: ${username} (${socket.id})`);

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Handle chat messages
    socket.on('chat:message', async (data) => {
      try {
        // Broadcast to user's room (for AI chat)
        socket.emit('chat:response', {
          message: `I understand you're learning ${data.language || 'a language'}. Let's practice!`,
          timestamp: new Date(),
        });
      } catch (error) {
        socket.emit('chat:error', { message: 'Error processing message' });
      }
    });

    // Handle community messages
    socket.on('community:join', (channelId) => {
      socket.join(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('community:user-joined', {
        userId,
        username,
      });
    });

    socket.on('community:message', (data) => {
      socket.to(`channel:${data.channelId}`).emit('community:new-message', {
        userId,
        username,
        message: data.message,
        timestamp: new Date(),
      });
    });

    socket.on('community:leave', (channelId) => {
      socket.leave(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('community:user-left', {
        userId,
        username,
      });
    });

    // Handle typing indicators
    socket.on('typing:start', (data) => {
      if (data.channelId) {
        socket.to(`channel:${data.channelId}`).emit('typing:start', { userId, username });
      }
    });

    socket.on('typing:stop', (data) => {
      if (data.channelId) {
        socket.to(`channel:${data.channelId}`).emit('typing:stop', { userId });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`❌ User disconnected: ${username} (${socket.id})`);
    });
  });

  return io;
};

export const getSocketIO = () => {
  // This will be set by initializeSocket
  return global.io || null;
};


