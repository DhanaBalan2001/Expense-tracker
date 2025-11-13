import Expense from '../models/Expense.js';
import Bill from '../models/Bill.js';
import { catchAsync, AppError } from '../middleware/error.js';

export const getExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
  res.json(expenses);
});

export const createExpense = catchAsync(async (req, res, next) => {
  if (!req.body.title || !req.body.amount || !req.body.category) {
    return next(new AppError('Please provide title, amount and category', 400));
  }

  const expense = await Expense.create({
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
    userId: req.user._id
  });

  res.status(201).json(expense);
});

export const updateExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!expense) {
    return next(new AppError('Expense not found or unauthorized', 404));
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedExpense);
});

export const deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user._id
  });
  
  if (!expense) {
    return next(new AppError('Expense not found or unauthorized', 404));
  }
  
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted successfully' });
});

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseStats = catchAsync(async (req, res, next) => {
  const totalExpenses = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        avgAmount: { $avg: "$amount" },
        maxAmount: { $max: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);

  const categoryWiseTotal = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ]);

  res.json({
    summary: totalExpenses[0] || { total: 0, avgAmount: 0, maxAmount: 0, count: 0 },
    byCategory: categoryWiseTotal
  });
});

export const getMonthlyExpenses = async (req, res) => {
  try {
    const monthlyData = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, minAmount, maxAmount } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category) {
      query.category = category;
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgetOverview = catchAsync(async (req, res, next) => {
  const monthlySpending = await Expense.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: {
          $gte: new Date(new Date().setDate(1))
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        transactions: { $sum: 1 }
      }
    }
  ]);

  res.json({
    currentMonth: {
      spending: monthlySpending[0]?.total || 0,
      transactions: monthlySpending[0]?.transactions || 0
    }
  });
});

export const getSpendingTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const trends = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryInsights = catchAsync(async (req, res, next) => {
  const insights = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
        averageExpense: { $avg: "$amount" },
        maxExpense: { $max: "$amount" },
        frequency: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } }
  ]);

  res.json(insights);
});

export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    res.json(recentExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForecast = async (req, res) => {
  try {
    const userId = req.user._id;
    const historicalData = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$category"
          },
          avgSpending: { $avg: "$amount" }
        }
      }
    ]);
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, categories } = req.query;
    
    const report = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          },
          category: { $in: categories.split(',') }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          items: { $push: "$ROOT" }
        }
      }
    ]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setBudgetAlert = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, limit } = req.body;
    
    const currentSpending = await Expense.aggregate([
      {
        $match: {
          userId,
          category,
          date: {
            $gte: new Date(new Date().setDate(1))
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const alert = {
      status: currentSpending[0]?.total > limit ? 'exceeded' : 'within_limit',
      limit: limit,
      current: currentSpending[0]?.total || 0,
      remaining: limit - (currentSpending[0]?.total || 0)
    };

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const compareExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period1Start, period1End, period2Start, period2End } = req.query;

    const [period1Data, period2Data] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: new Date(period1Start), $lte: new Date(period1End) }
          }
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        }
      ]),
      Expense.aggregate([
        {
          $match: {
            userId,
            date: { $gte: new Date(period2Start), $lte: new Date(period2End) }
          }
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        }
      ])
    ]);

    res.json({
      period1: period1Data,
      period2: period2Data,
      comparison: period1Data.map(p1 => {
        const p2 = period2Data.find(p2 => p2._id === p1._id);
        return {
          category: p1._id,
          difference: p1.total - (p2?.total || 0),
          percentageChange: ((p1.total - (p2?.total || 0)) / (p2?.total || 1)) * 100
        };
      })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackSavingsGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetAmount, targetDate, category } = req.body;

    const currentSavings = await Expense.aggregate([
      {
        $match: {
          userId,
          category,
          date: { $lte: new Date() }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const progress = {
      target: targetAmount,
      current: currentSavings[0]?.total || 0,
      remaining: targetAmount - (currentSavings[0]?.total || 0),
      percentageAchieved: ((currentSavings[0]?.total || 0) / targetAmount) * 100,
      daysRemaining: Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setBillReminder = catchAsync(async (req, res, next) => {
  const { title, amount, dueDate, category, recurring } = req.body;

  if (!title || !amount || !dueDate || !category) {
    return next(new AppError('Please provide all required bill details', 400));
  }

  const reminder = new Bill({
    userId: req.user._id,
    title,
    amount,
    dueDate: new Date(dueDate),
    category,
    recurring,
    status: 'pending'
  });

  const savedReminder = await reminder.save();
  const upcomingBills = await Bill.find({
    userId: req.user._id,
    dueDate: { $gte: new Date() }
  }).sort({ dueDate: 1 });

  res.status(201).json({
    message: 'Bill reminder set successfully',
    reminder: savedReminder,
    upcomingBills
  });
});

export const markBillAsPaid = catchAsync(async (req, res, next) => {
  const bill = await Bill.findOne({
    _id: req.params.billId,
    userId: req.user._id
  });

  if (!bill) {
    return next(new AppError('Bill not found or unauthorized', 404));
  }

  bill.status = 'paid';
  bill.paidDate = new Date();
  await bill.save();

  let newBill;
  if (bill.recurring) {
    const nextDueDate = new Date(bill.dueDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    
    newBill = await Bill.create({
      userId: bill.userId,
      title: bill.title,
      amount: bill.amount,
      dueDate: nextDueDate,
      category: bill.category,
      recurring: bill.recurring,
      status: 'pending'
    });
  }

  res.json({
    message: 'Bill marked as paid',
    paidBill: bill,
    nextBill: newBill
  });
});

export const getUpcomingBills = catchAsync(async (req, res, next) => {
  const bills = await Bill.find({
    userId: req.user._id,
    dueDate: { $gte: new Date() }
  }).sort({ dueDate: 1 });

  res.json({
    total: bills.reduce((sum, bill) => sum + bill.amount, 0),
    count: bills.length,
    nextDue: bills[0]?.dueDate,
    bills
  });
});