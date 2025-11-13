import User from '../models/User.js';
import { catchAsync, AppError } from '../middleware/error.js';

// Get user settings
export const getSettings = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('settings');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json(user.settings);
});

// Update user settings
export const updateSettings = catchAsync(async (req, res) => {
  const { currency, theme, language, notifications, defaultView } = req.body;
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { 
      settings: {
        currency,
        theme,
        language,
        notifications,
        defaultView
      }
    },
    { new: true, runValidators: true }
  ).select('settings');
  
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  
  res.json(updatedUser.settings);
});

// Update specific setting
export const updateSetting = catchAsync(async (req, res) => {
  const { setting, value } = req.body;
  
  if (!setting) {
    throw new AppError('Please specify which setting to update', 400);
  }
  
  // Create update object with dot notation for nested fields
  const updateObj = {};
  updateObj[`settings.${setting}`] = value;
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateObj },
    { new: true, runValidators: true }
  ).select('settings');
  
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  
  res.json(updatedUser.settings);
});
