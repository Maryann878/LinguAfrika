# Security Implementation Guide

This document outlines the comprehensive security measures implemented in the LinguAfrika application.

## 🔒 Security Features Implemented

### 1. **Security Headers (Helmet.js)**
- **XSS Protection**: Prevents cross-site scripting attacks
- **Content Security Policy (CSP)**: Restricts resource loading
- **HSTS**: Forces HTTPS connections (1 year duration)
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer Policy**: Controls referrer information
- **Permissions Policy**: Restricts browser features

### 2. **NoSQL Injection Protection**
- **express-mongo-sanitize**: Sanitizes user input to prevent MongoDB injection
- Automatically removes `$` and `.` operators from user input
- Logs injection attempts for monitoring

### 3. **HTTP Parameter Pollution Protection**
- **hpp**: Prevents parameter pollution attacks
- Whitelists safe parameters (filter, sort, page, limit, fields)
- Prevents duplicate parameters from being processed

### 4. **Input Validation & Sanitization**
- **express-validator**: Comprehensive input validation
- **HTML Escaping**: Prevents XSS through user input
- **Length Limits**: Prevents buffer overflow attacks
- **Pattern Matching**: Validates email, phone, username formats
- **Custom Validation**: Checks for common weak passwords

### 5. **Rate Limiting**
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes
- **Password Reset**: 3 requests per hour
- **Email Verification**: 3 requests per 15 minutes
- **Chat/AI**: 10 messages per minute

### 6. **Request Size Limits**
- **Body Size**: Maximum 10MB per request
- **File Upload**: Maximum 5MB per file
- **Field Limits**: Prevents DoS through large payloads

### 7. **File Upload Security**
- **MIME Type Validation**: Only allows image types (JPEG, PNG, GIF, WebP)
- **Extension Validation**: Checks file extensions
- **Filename Sanitization**: Removes dangerous patterns
- **Size Limits**: 5MB maximum file size
- **Unique Filenames**: Prevents file overwrite attacks

### 8. **Authentication & Authorization**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: Configurable token lifetime
- **Role-Based Access**: Admin, instructor, student roles
- **Protected Routes**: Middleware for route protection

### 9. **Password Security**
- **Minimum Length**: 8 characters
- **Complexity Requirements**:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Common Password Detection**: Blocks weak passwords
- **Maximum Length**: 128 characters

### 10. **Error Handling**
- **No Information Leakage**: Generic error messages in production
- **Structured Logging**: Detailed logs in development only
- **Error Sanitization**: Prevents stack trace exposure

## 📋 Validation Rules

### Signup Validation
- **Username**: 3-20 characters, alphanumeric + underscore only
- **Email**: Valid email format, max 255 characters
- **Mobile**: 10-15 characters, valid phone format
- **Password**: 8-128 characters, complexity requirements

### Login Validation
- **Identifier**: Email or username, max 255 characters
- **Password**: Required, max 128 characters

### Profile Update Validation
- **First/Last Name**: Max 50 characters, letters/spaces/hyphens only
- **Bio**: Max 500 characters
- **Country/Location**: Max 100 characters
- **Gender**: Enum validation (Male, Female, Other)
- **Age Range**: Enum validation (13-17, 18-24, 25-34, 35-44, 45+)

### OTP Validation
- **Code**: 4-6 characters, numbers only

## 🛡️ Security Best Practices

### For Developers

1. **Always Validate Input**
   ```javascript
   import { validate, validateSignup } from '../middleware/validate.js';
   router.post('/signup', validate(validateSignup), signup);
   ```

2. **Use Sanitization**
   - All user input is automatically sanitized
   - Use `escape()` in validation rules for HTML content

3. **Protect Routes**
   ```javascript
   import { authenticate } from '../middleware/auth.js';
   router.use(authenticate);
   ```

4. **Handle File Uploads Safely**
   ```javascript
   import { uploadProfileImageMiddleware } from '../utils/upload.js';
   router.post('/upload', uploadProfileImageMiddleware, handleUpload);
   ```

5. **Rate Limit Sensitive Endpoints**
   ```javascript
   import { authLimiter } from '../middleware/rateLimiter.js';
   router.post('/login', authLimiter, validate(validateLogin), login);
   ```

### Security Checklist

- [x] Security headers configured
- [x] NoSQL injection protection
- [x] XSS protection
- [x] CSRF protection (via SameSite cookies)
- [x] Rate limiting implemented
- [x] Input validation on all endpoints
- [x] File upload security
- [x] Password complexity requirements
- [x] Error message sanitization
- [x] Request size limits
- [x] Parameter pollution protection

## 🔍 Monitoring & Logging

### Security Events Logged
- NoSQL injection attempts
- Rate limit violations
- File upload errors
- Authentication failures
- Validation errors

### Log Locations
- Console logs (development)
- Error handler logs all security events
- Rate limiter logs violations

## 🚨 Incident Response

If a security issue is detected:

1. **Immediate Actions**:
   - Check rate limiter logs
   - Review error logs for patterns
   - Check for unusual traffic patterns

2. **Investigation**:
   - Review sanitization logs
   - Check validation error patterns
   - Analyze file upload attempts

3. **Remediation**:
   - Update rate limits if needed
   - Add additional validation rules
   - Block malicious IPs if necessary

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## 🔄 Regular Security Updates

- Review and update dependencies monthly
- Monitor security advisories
- Update validation rules as needed
- Review rate limits based on usage patterns
- Audit file upload security quarterly

---

**Last Updated**: December 2024
**Maintained By**: LinguAfrika Development Team

