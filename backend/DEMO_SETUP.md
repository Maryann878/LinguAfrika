# Demo Setup Guide

## Complete Workflow

### Step 1: Ensure MongoDB is Running
Make sure your MongoDB instance is running (either locally or cloud). The backend will connect to it automatically when started.

### Step 2: Seed Demo Data
From the root directory, run:

```bash
cd backend
npm run seed:demo
```

This will create:
- Demo user account (demo@linguafrika.com / Demo123!)
- Courses (Yoruba, Hausa, Igbo, Efik)
- Lessons for each course
- Demo user progress on multiple courses
- Community posts and replies
- AI chat history
- Quiz attempts
- Notifications

### Step 3: Start the Application
From the **root directory**, start both frontend and backend:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Step 4: Login for Demo
Use these credentials:
- **Email**: demo@linguafrika.com
- **Password**: Demo123!

## Quick Commands Reference

```bash
# Seed demo data (run once before demo)
cd backend && npm run seed:demo

# Start everything (from root)
npm run dev

# Clear demo data (to reset between demos)
cd backend && npm run seed:demo:clear && npm run seed:demo
```

## What's Included

### Demo User Profile
- Name: Maya Maryann
- Complete profile with bio, location, goals
- Profile picture ready (can be uploaded)

### Learning Progress
- **Yoruba**: 45% complete, in progress
- **Hausa**: 30% complete, in progress  
- **Igbo**: 100% complete (completed course)

### Community Activity
- Posts in Yoruba Learners, Igbo Community, and General Discussion
- Replies to posts
- Active community engagement

### AI Chat History
- Sample conversations about learning Yoruba
- Questions about greetings and common phrases
- Realistic chat interactions

### Quizzes
- Completed quiz on Yoruba basics
- 100% score achieved
- Ready to show quiz functionality

### Notifications
- Mix of read and unread notifications
- Various types: achievements, course updates, community activity

## Tips for Demo

1. **Start with Dashboard**: Shows progress across multiple courses
2. **Show Profile**: Complete profile with all fields filled
3. **Navigate to Languages**: Browse available courses
4. **Check Progress Page**: See detailed learning statistics
5. **Visit Community**: Show active discussions
6. **Open AI Chat**: Show conversation history
7. **View Notifications**: Show notification system

## Resetting Between Demos

If you need a fresh start:
```bash
cd backend
npm run seed:demo:clear
npm run seed:demo
```

Then restart your servers from root:
```bash
npm run dev
```

This ensures clean, consistent demo data for each presentation.

## Troubleshooting

### Demo user already exists
The script will automatically delete and recreate the demo user if it already exists. This ensures fresh data each time.

### Database connection issues
Make sure your MongoDB is running and the connection string in `.env` is correct.

### Missing data
If some data doesn't appear, make sure:
1. All models are properly imported
2. Database connection is successful
3. No errors occurred during seeding (check console output)

