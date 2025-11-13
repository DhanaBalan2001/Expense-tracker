import Recurring from '../models/Recurring.js';
import { catchAsync, AppError } from '../middleware/error.js';

const calculateNextDueDate = (frequency) => {
  const today = new Date();
  switch (frequency) {
    case 'daily':
      return new Date(today.setDate(today.getDate() + 1));
    case 'weekly':
      return new Date(today.setDate(today.getDate() + 7));
    case 'monthly':
      return new Date(today.setMonth(today.getMonth() + 1));
    case 'yearly':
      return new Date(today.setFullYear(today.getFullYear() + 1));
    default:
      return new Date(today.setMonth(today.getMonth() + 1));
  }
};

export const scheduleRecurringExpense = catchAsync(async (req, res) => {
  const { title, amount, category, frequency } = req.body;

  if (!title || !amount || !category || !frequency) {
      return next(new AppError('Please provide all required fields', 400));
  }

  const recurring = await Recurring.create({
      userId: req.user._id,
      title,
      amount,
      category,
      frequency,
      nextDueDate: calculateNextDueDate(frequency),
      active: true
  });

  res.status(201).json({
      status: 'success',
      data: recurring
  });
});

export const getRecurringExpenses = catchAsync(async (req, res) => {
  const recurrings = await Recurring.find({
    userId: req.user._id,
    active: true
  }).sort({ nextDueDate: 1 });

  res.json({
    count: recurrings.length,
    data: recurrings
  });
});

export const updateRecurring = catchAsync(async (req, res) => {
  const recurring = await Recurring.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!recurring) {
    throw new AppError('Recurring expense not found', 404);
  }

  res.json({
    status: 'success',
    data: recurring
  });
});

export const deleteRecurring = catchAsync(async (req, res) => {
  const recurring = await Recurring.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!recurring) {
    throw new AppError('Recurring expense not found', 404);
  }

  res.json({
    status: 'success',
    message: 'Recurring expense deleted'
  });
});
