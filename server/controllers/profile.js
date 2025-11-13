import User from '../models/User.js';
import { catchAsync, AppError } from '../middleware/error.js';
import bcrypt from 'bcryptjs';

// Get current user profile
export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json(user);
});

// Update user profile
export const updateProfile = catchAsync(async (req, res) => {
  const { username, email, firstName, lastName, phone, avatar } = req.body;
  
  // Check if username or email is already taken
  if (username) {
    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
      throw new AppError('Username is already taken', 400);
    }
  }
  
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      throw new AppError('Email is already taken', 400);
    }
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { username, email, firstName, lastName, phone, avatar },
    { new: true, runValidators: true }
  ).select('-password');
  
  res.json(updatedUser);
});

// Change password
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new password', 400);
  }
  
  const user = await User.findById(req.user._id).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  res.json({ message: 'Password updated successfully' });
});

// Delete account
export const deleteAccount = catchAsync(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    throw new AppError('Please provide your password', 400);
  }
  
  const user = await User.findById(req.user._id).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Password is incorrect', 401);
  }
  
  // Delete user and all associated data
  await User.findByIdAndDelete(req.user._id);
  
  // Here you would also delete all user data (expenses, budgets, etc.)
  // This depends on your data model and relationships
  
  res.json({ message: 'Account deleted successfully' });
});
