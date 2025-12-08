import { User } from '../models/User.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';
import path from 'path';

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  // Check if user exists first
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Protect demo account from modification in production (except profile image)
  if (user.email === 'demo@linguafrika.com' && process.env.NODE_ENV === 'production') {
    // Allow profile image updates via this endpoint too
    if (req.file) {
      const fileUrl = `/uploads/profiles/${req.file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: fileUrl },
        { new: true, runValidators: true }
      );
      return res.json({
        success: true,
        message: 'Profile image updated successfully',
        data: updatedUser,
      });
    }
    // Block other modifications
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
    // Check if there was a multer error
    if (req.fileValidationError) {
      throw new AppError(req.fileValidationError, 400);
    }
    throw new AppError('No file uploaded. Please select an image file.', 400);
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Allow profile image uploads for demo account (this is a reasonable modification)
  // Other profile fields are still protected in updateProfile
  // Note: Profile image uploads are allowed for demo account in both development and production

  // Construct the URL path for the uploaded file
  const fileUrl = `/uploads/profiles/${req.file.filename}`;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: fileUrl },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new AppError('Failed to update profile image', 500);
    }

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: fileUrl,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw new AppError('Failed to save profile image. Please try again.', 500);
  }
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

