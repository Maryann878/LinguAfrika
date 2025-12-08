# Email Setup Guide - Resend Integration

This guide explains how to set up email functionality for LinguAfrika using Resend.

## Overview

LinguAfrika uses [Resend](https://resend.com) for sending emails. The app sends:
- **Verification emails** - When users sign up
- **Password reset OTP** - When users request password reset
- **Resend verification code** - When users request a new verification code

## Setup Steps

### 1. Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key

1. Go to Resend Dashboard → API Keys
2. Click "Create API Key"
3. Give it a name (e.g., "LinguAfrika Production")
4. Copy the API key (starts with `re_...`)
5. **Important**: Save it immediately - you won't be able to see it again!

### 3. Verify Domain (Optional but Recommended)

For production, you should verify your own domain:

1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `linguafrika.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

**Note**: For testing, you can use the default `onboarding@resend.dev` email, but it has limitations.

### 4. Set Environment Variables

#### For Local Development (`.env` file):

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=LinguAfrika <onboarding@resend.dev>
```

Or if you verified your domain:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=LinguAfrika <noreply@yourdomain.com>
```

#### For Railway (Production):

1. Go to Railway → Your Backend Service → Variables
2. Add:
   - **Variable name**: `RESEND_API_KEY`
   - **Variable value**: `re_your_api_key_here`
3. Add (optional):
   - **Variable name**: `RESEND_FROM_EMAIL`
   - **Variable value**: `LinguAfrika <noreply@yourdomain.com>` or `LinguAfrika <onboarding@resend.dev>`

## How It Works

### Development Mode (No API Key)

If `RESEND_API_KEY` is not set:
- Emails are logged to the console instead of being sent
- OTP codes are displayed in the console for testing
- This is perfect for local development

### Production Mode (With API Key)

If `RESEND_API_KEY` is set:
- Emails are sent via Resend API
- Users receive actual emails
- OTP codes are sent to user's email address

## Testing Email Functionality

### Test Verification Email

1. Sign up with a new account
2. Check your email inbox (or console logs if no API key)
3. You should receive a 6-digit verification code

### Test Password Reset

1. Go to "Forgot Password" page
2. Enter your email
3. Check your email inbox (or console logs if no API key)
4. You should receive a 6-digit reset code

### Test Resend Functionality

1. On verification or reset OTP page
2. Click "Resend" button
3. Check your email inbox (or console logs if no API key)
4. You should receive a new code

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly in Railway
2. **Check From Email**: Make sure `RESEND_FROM_EMAIL` is verified in Resend
3. **Check Railway Logs**: Look for email sending errors in Railway logs
4. **Check Resend Dashboard**: Go to Resend → Logs to see email delivery status

### Common Errors

**"Failed to send email: Invalid API key"**
- Solution: Check that `RESEND_API_KEY` is correct and starts with `re_`

**"Failed to send email: Domain not verified"**
- Solution: Verify your domain in Resend or use `onboarding@resend.dev` for testing

**"Failed to send email: Rate limit exceeded"**
- Solution: Resend free tier has limits. Upgrade plan or wait for rate limit reset

### Development Mode

If you see in console:
```
📧 Email would be sent: { to: 'user@example.com', subject: '...' }
🔑 Code: 123456
```

This means:
- ✅ Email service is working correctly
- ⚠️ No API key set (development mode)
- 📧 Emails are logged instead of sent
- 🔑 OTP codes are shown in console for testing

## Resend Free Tier Limits

- **3,000 emails/month** (free tier)
- **100 emails/day** (free tier)
- **Unlimited** for verified domains (with paid plan)

## Security Notes

- **Never commit API keys to Git**
- Store API keys in environment variables only
- Use different API keys for development and production
- Rotate API keys periodically

## Next Steps

1. Set up Resend account
2. Get API key
3. Add `RESEND_API_KEY` to Railway environment variables
4. Test email functionality
5. (Optional) Verify your domain for production use

