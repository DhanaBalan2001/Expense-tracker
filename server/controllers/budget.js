import Budget from '../models/Budget.js';
import { catchAsync, AppError } from '../middleware/error.js';

export const getBudgets = catchAsync(async (req, res) => {
  const budgets = await Budget.find({ userId: req.user._id });
  res.json(budgets);
});

export const createBudget = catchAsync(async (req, res) => {
  const { category, amount, period } = req.body;
  
  if (!category || !amount || !period) {
    throw new AppError('Please provide category, amount and period', 400);
  }
  
  const budget = await Budget.create({
    userId: req.user._id,
    category,
    amount,
    period,
    spent: 0
  });
  
  res.status(201).json(budget);
});

export const updateBudget = catchAsync(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!budget) {
    throw new AppError('Budget not found or unauthorized', 404);
  }
  
  res.json(budget);
});

export const deleteBudget = catchAsync(async (req, res) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!budget) {
    throw new AppError('Budget not found or unauthorized', 404);
  }
  
  res.json({ message: 'Budget deleted successfully' });
});

export const getBudgetOverview = catchAsync(async (req, res) => {
  const budgets = await Budget.find({ userId: req.user._id });
  
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  
  res.json({
    totalBudget,
    totalSpent,
    remaining: totalBudget - totalSpent,
    budgetCount: budgets.length
  });
});
