import { User } from '../models/User.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { generateVerificationCode, generateResetToken } from '../utils/generateCode.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordResetOTP } from '../utils/sendEmail.js';

export const signup = asyncHandler(async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Validate required fields
  if (!username || !email || !mobile || !password) {
    throw new AppError('All fields are required', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  try {
    // Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      mobile,
      password,
      profileComplete: false,
      isVerified: false,
    });

    // Generate verification code
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send verification email (non-blocking)
    sendVerificationEmail(email, verificationCode).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle Mongoose errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      throw new AppError(errors[0] || 'Validation error', 400);
    }
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Remove password from response
  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    success: true,
    token,
    user: userObj,
    profileComplete: user.profileComplete,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('Email already verified', 400);
  }

  if (user.verificationCode !== code) {
    throw new AppError('Invalid verification code', 400);
  }

  if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
    throw new AppError('Verification code expired', 400);
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully',
  });
});

export const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('Email already verified', 400);
  }

  const verificationCode = generateVerificationCode();
  user.verificationCode = verificationCode;
  user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendVerificationEmail(email, verificationCode);

  res.json({
    success: true,
    message: 'Verification code sent to your email',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists for security
    return res.json({
      success: true,
      message: 'If an account exists with this email, a password reset code has been sent',
    });
  }

  // Generate OTP for password reset
  const resetOTP = generateVerificationCode();
  user.resetPasswordOTP = resetOTP;
  user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // Send OTP email (non-blocking)
  sendPasswordResetOTP(email, resetOTP).catch(err => {
    console.error('Failed to send password reset OTP:', err);
  });

  res.json({
    success: true,
    message: 'Password reset code sent to your email',
  });
});

export const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new AppError('Email and code are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.resetPasswordOTP !== code) {
    throw new AppError('Invalid verification code', 400);
  }

  if (user.resetPasswordOTPExpires && user.resetPasswordOTPExpires < new Date()) {
    throw new AppError('Verification code expired', 400);
  }

  // Generate reset token for password reset
  const resetToken = generateResetToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Code verified successfully',
    token: resetToken,
  });
});

export const resendPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists for security
    return res.json({
      success: true,
      message: 'If an account exists with this email, a password reset code has been sent',
    });
  }

  // Generate new OTP
  const resetOTP = generateVerificationCode();
  user.resetPasswordOTP = resetOTP;
  user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // Send OTP email (non-blocking)
  sendPasswordResetOTP(email, resetOTP).catch(err => {
    console.error('Failed to send password reset OTP:', err);
  });

  res.json({
    success: true,
    message: 'Password reset code sent to your email',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password) {
    throw new AppError('Token and password are required', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

