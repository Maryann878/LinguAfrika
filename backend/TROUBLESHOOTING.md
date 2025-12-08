# Troubleshooting Guide

## Signup 500 Error

If you're getting a 500 error on signup, check the following:

### 1. Check Backend Logs
Look at the terminal where the backend is running. The error handler now logs detailed information including:
- Error message
- Error name/type
- Error code
- Request path and method
- Request body (in development mode)

### 2. Common Issues

#### Validation Errors
- Password must be at least 6 characters
- Password must contain: uppercase letter, lowercase letter, and number
- Username must be 3-20 characters (letters, numbers, underscores only)
- Email must be valid format
- Mobile must be at least 10 characters

#### Database Errors
- Make sure MongoDB is running
- Check MongoDB connection string in `.env`
- Ensure no duplicate email/username exists

#### Missing Environment Variables
Check that `.env` file exists in `backend/` with:
```
MONGODB_URI=mongodb://localhost:27017/linguafrika
JWT_SECRET=your-secret-key-here
```

### 3. Test the Connection

Try the test endpoint:
```bash
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 4. Check Frontend Network Tab

In browser DevTools → Network tab:
- Check the request payload
- Check the response status and message
- Look for CORS errors

### 5. Common Fixes

**If validation is failing:**
- Check password meets requirements
- Check username format
- Check email format

**If database error:**
- Restart MongoDB
- Check connection string
- Clear existing users if testing

**If still getting 500:**
- Check backend terminal for detailed error logs
- The error handler now shows full error details in development mode


