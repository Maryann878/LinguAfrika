# LinguAfrika Backend

Complete Express + Node.js + MongoDB backend API with Socket.IO support.

## ✅ Complete Backend Structure

### 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── env.ts           # Environment configuration
│   ├── models/
│   │   ├── User.ts          # User model
│   │   ├── Course.ts         # Course model
│   │   ├── Lesson.ts         # Lesson model
│   │   ├── Progress.ts       # Progress tracking model
│   │   ├── Community.ts      # Channel, Post, Reply models
│   │   ├── Quiz.ts           # Quiz and QuizAttempt models
│   │   └── Chat.ts           # Chat message model
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── courseController.ts
│   │   ├── lessonController.ts
│   │   ├── communityController.ts
│   │   ├── chatController.ts
│   │   └── quizController.ts
│   ├── middleware/
│   │   ├── auth.ts           # Authentication middleware
│   │   └── validate.ts       # Validation middleware
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── lessonRoutes.ts
│   │   ├── communityRoutes.ts
│   │   ├── chatRoutes.ts
│   │   └── quizRoutes.ts
│   ├── socket/
│   │   └── socket.ts         # Socket.IO setup
│   ├── utils/
│   │   ├── generateToken.ts
│   │   ├── generateCode.ts
│   │   ├── sendEmail.ts
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── seedData.ts
│   └── server.ts             # Main server file
├── .env.example
├── package.json
└── tsconfig.json
```

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /verify` - Verify email
- `POST /resend-verification` - Resend verification code
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /me` - Get current user (protected)

### Users (`/api/users`)
- `GET /` - Get all users (protected)
- `GET /:id` - Get user by ID (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /onboarding` - Complete onboarding (protected)

### Courses (`/api/courses`)
- `GET /` - Get all courses
- `GET /:id` - Get course by ID
- `GET /name/:name` - Get course by name
- `GET /:courseId/progress` - Get user progress (protected)
- `PUT /:courseId/progress` - Update progress (protected)

### Lessons (`/api/lessons`)
- `GET /course/:courseId` - Get lessons by course (protected)
- `GET /course/:courseId/levels` - Get levels by course (protected)
- `GET /:id` - Get lesson by ID (protected)

### Community (`/api/community`)
- `GET /channels` - Get all channels (protected)
- `GET /channels/:name` - Get channel by name (protected)
- `GET /channels/:channelId/posts` - Get channel posts (protected)
- `POST /channels/:channelId/posts` - Create post (protected)
- `GET /posts/:postId/replies` - Get post replies (protected)
- `POST /posts/:postId/replies` - Create reply (protected)

### Chat (`/api/chat`)
- `GET /history` - Get chat history (protected)
- `POST /message` - Send chat message (protected)

### Quiz (`/api/quiz`)
- `GET /:id` - Get quiz (protected)
- `POST /:id/submit` - Submit quiz (protected)
- `GET /:quizId/attempts` - Get quiz attempts (protected)

## 🔌 Socket.IO Events

### Client → Server
- `chat:message` - Send chat message
- `community:join` - Join community channel
- `community:message` - Send community message
- `community:leave` - Leave community channel
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `chat:response` - AI chat response
- `chat:error` - Chat error
- `community:new-message` - New community message
- `community:user-joined` - User joined channel
- `community:user-left` - User left channel
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/linguafrika
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Error handling middleware
- CORS configuration
- Protected routes

## 📊 Database Models

- **User**: Authentication, profile, onboarding
- **Course**: Language courses
- **Lesson**: Course lessons
- **Progress**: User learning progress
- **Channel/Post/Reply**: Community features
- **Quiz/QuizAttempt**: Assessments
- **ChatMessage**: AI chat history

## 🎯 Next Steps

1. Integrate email service (SendGrid, Nodemailer, etc.)
2. Integrate AI service for chat (OpenAI, etc.)
3. Add file upload for profile images
4. Add rate limiting
5. Add request logging
6. Add API documentation (Swagger)

