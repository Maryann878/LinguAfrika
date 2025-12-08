# API Services

This directory contains all API service functions for communicating with the backend.

## Services

### `api.ts`
- Base axios instance with interceptors
- Automatically adds authentication token to requests
- Handles 401 errors (unauthorized) by redirecting to login

### `auth.ts`
- `loginUser()` - User login
- `signupUser()` - User registration
- `verifyEmail()` - Email verification
- `resendVerificationCode()` - Resend verification code
- `forgotPassword()` - Request password reset
- `resetPassword()` - Reset password with token
- `getCurrentUser()` - Get current authenticated user

### `userService.ts`
- `getUserById()` - Get user by ID
- `updateProfile()` - Update user profile
- `updateOnboarding()` - Complete onboarding process

### `courseService.ts`
- `getAllCourses()` - Get all courses
- `getCourseById()` - Get course by ID
- `getCourseByName()` - Get course by name
- `getUserProgress()` - Get user progress for a course
- `updateProgress()` - Update learning progress

## Usage

```typescript
import { loginUser } from '@/services/auth';
import { getAllCourses } from '@/services/courseService';

// Login
const response = await loginUser({ identifier: 'user@example.com', password: 'password' });

// Get courses
const courses = await getAllCourses();
```

## Configuration

All API calls use the `/api` prefix which is proxied to `http://localhost:5000` by Vite during development.

Authentication tokens are automatically added to requests via the axios interceptor in `api.ts`.


