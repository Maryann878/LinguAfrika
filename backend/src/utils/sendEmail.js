import { Resend } from 'resend';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Default from email (should be verified in Resend)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LinguAfrika <onboarding@resend.dev>';

export const sendEmail = async (options) => {
  try {
    // If no API key, fall back to console logging
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Email content:', options.html);
        // In development, extract and log the OTP/code for testing
        const codeMatch = options.html.match(/<p[^>]*style[^>]*font-size:\s*36px[^>]*>(\d+)<\/p>/);
        if (codeMatch) {
          console.log('🔑 Code:', codeMatch[1]);
        }
      }
      
      // Return early if no API key (development mode)
      return { success: true, id: 'dev-mode' };
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, code) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #E37400 0%, #FF9500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LinguAfrika</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
          <p style="color: #666; font-size: 16px;">Thank you for signing up! Please verify your email address by entering the code below:</p>
          <div style="background: #f8f8f8; border: 2px dashed #E37400; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your verification code:</p>
            <p style="font-size: 36px; font-weight: bold; color: #E37400; letter-spacing: 8px; margin: 0;">${code}</p>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #999; font-size: 14px; margin-top: 10px;">If you didn't create an account, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2024 LinguAfrika. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Verify Your LinguAfrika Account',
    html,
  });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #E37400 0%, #FF9500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LinguAfrika</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; font-size: 16px;">Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #E37400; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">This link will expire in <strong>1 hour</strong>.</p>
          <p style="color: #999; font-size: 14px; margin-top: 10px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2024 LinguAfrika. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Reset Your LinguAfrika Password',
    html,
  });
};

export const sendPasswordResetOTP = async (email, code) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #E37400 0%, #FF9500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">LinguAfrika</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; font-size: 16px;">You requested to reset your password. Enter the code below to continue:</p>
          <div style="background: #f8f8f8; border: 2px dashed #E37400; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your password reset code:</p>
            <p style="font-size: 36px; font-weight: bold; color: #E37400; letter-spacing: 8px; margin: 0;">${code}</p>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #999; font-size: 14px; margin-top: 10px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2024 LinguAfrika. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  
  await sendEmail({
    to: email,
    subject: 'Password Reset Code - LinguAfrika',
    html,
  });
};
