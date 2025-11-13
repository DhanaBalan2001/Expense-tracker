import Expense from '../models/Expense.js';
import { catchAsync } from '../middleware/error.js';

const getMonthlyTrends = async (userId) => {
  return await Expense.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" }
        },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }
  ]);
};

const getCategoryBreakdown = async (userId) => {
  return await Expense.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

const getRecentActivity = async (userId, limit = 5) => {
  return await Expense.find({ userId })
    .sort({ date: -1 })
    .limit(limit);
};

export const getDashboardStats = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const [monthlyTrends, categoryBreakdown, recentTransactions] = await Promise.all([
    getMonthlyTrends(userId),
    getCategoryBreakdown(userId),
    getRecentActivity(userId, 5)
  ]);

  res.json({
    monthlyTrends,
    categoryBreakdown,
    recentTransactions
  });
});
