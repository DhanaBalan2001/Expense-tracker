import Goal from '../models/Goal.js';
import { catchAsync, AppError } from '../middleware/error.js';

export const setFinancialGoal = catchAsync(async (req, res) => {
  const { targetAmount, deadline, category, description } = req.body;
  const goal = await Goal.create({
    userId: req.user._id,
    targetAmount,
    deadline,
    category,
    description
  });
  res.status(201).json(goal);
});

export const getGoals = catchAsync(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id });
  res.json(goals);
});

export const updateGoal = catchAsync(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!goal) {
    throw new AppError('Goal not found', 404);
  }
  
  res.json(goal);
});

export const deleteGoal = catchAsync(async (req, res) => {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!goal) {
    throw new AppError('Goal not found', 404);
  }
  
  res.json({ message: 'Goal deleted successfully' });
});
