import { User } from '../models/User.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';
import path from 'path';

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  // Protect demo account from modification in production
  const user = await User.findById(userId);
  if (user && user.email === 'demo@linguafrika.com' && process.env.NODE_ENV === 'production') {
    throw new AppError('Demo account cannot be modified in production', 403);
  }
  
  const updateData = { ...req.body };

  // Remove fields that shouldn't be updated directly
  delete updateData.password;
  delete updateData.email;
  delete updateData.role;

  // Handle file upload if present
  if (req.file) {
    // Construct the URL path for the uploaded file
    // In production, this would be a CDN URL or cloud storage URL
    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    updateData.profileImage = fileUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...updateData, profileComplete: true },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  // Construct the URL path for the uploaded file
  const fileUrl = `/uploads/profiles/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: fileUrl },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: {
      profileImage: fileUrl,
      user,
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').limit(100);

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

export const updateOnboarding = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { gender, ageRange, country, location, goals } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      gender,
      ageRange,
      country,
      location,
      goals,
      profileComplete: true,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Onboarding completed',
    data: user,
  });
});

