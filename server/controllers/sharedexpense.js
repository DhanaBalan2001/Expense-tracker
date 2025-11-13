import SharedExpense from '../models/Shared.js';
import { catchAsync, AppError } from '../middleware/error.js';
import User from '../models/User.js';

export const createSharedExpense = catchAsync(async (req, res) => {
  const { title, amount, participants, splitType } = req.body;

  if (!title || !amount || !participants) {
    throw new AppError('Please provide title, amount and participants', 400);
  }

  const formattedParticipants = await Promise.all(participants.map(async p => {
    let userId = p.user || p.userId;

    if (typeof userId === 'string' && userId.includes('@')) {
      const user = await User.findOne({ email: userId });
      if (!user) {
        throw new AppError(`User with email ${userId} not found`, 404);
      }
      userId = user._id;
    }

    const share = splitType === 'equal' ? amount / participants.length : p.share;

    return {
      user: userId,
      share: share,
      paid: false
    };
  }));

  const sharedExpense = await SharedExpense.create({
    createdBy: req.user._id,
    title,
    amount,
    participants: formattedParticipants,
    splitType
  });

  res.status(201).json({
    status: 'success',
    data: sharedExpense
  });
});

export const getSharedExpenses = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new AppError('User not authenticated', 401);
  }

  const sharedExpenses = await SharedExpense.find({
    $or: [
      { createdBy: req.user._id },
      { 'participants.user': req.user._id }
    ]
  }).populate('participants.user', 'username email');

  res.json({
    status: 'success',
    data: sharedExpenses
  });
});

export const updateSharedExpense = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new AppError('User not authenticated', 401);
  }

  const { amount, participants, splitType } = req.body;

  let updatedParticipants = participants;
  if (amount && splitType === 'equal') {
    updatedParticipants = participants.map(p => ({
      ...p,
      share: amount / participants.length
    }));
  }

  const sharedExpense = await SharedExpense.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    {
      ...req.body,
      participants: updatedParticipants
    },
    { new: true, runValidators: true }
  ).populate('participants.user', 'username email');

  if (!sharedExpense) {
    throw new AppError('Shared expense not found or unauthorized', 404);
  }

  res.json({
    status: 'success',
    data: sharedExpense
  });
});

export const deleteSharedExpense = catchAsync(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new AppError('User not authenticated', 401);
  }

  const sharedExpense = await SharedExpense.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!sharedExpense) {
    throw new AppError('Shared expense not found or unauthorized', 404);
  }

  res.json({
    status: 'success',
    message: 'Shared expense deleted successfully'
  });
});

export const settleExpense = catchAsync(async (req, res) => {
  const sharedExpense = await SharedExpense.findById(req.params.id);

  if (!sharedExpense) {
    throw new AppError('Shared expense not found', 404);
  }

  const participant = sharedExpense.participants.find(p => 
    p.user && p.user.toString() === req.user._id.toString()
  );

  if (!participant) {
    throw new AppError('You are not a participant in this expense', 403);
  }

  participant.paid = true;

  const allSettled = sharedExpense.participants.every(p => p.paid);
  if (allSettled) {
    sharedExpense.status = 'settled';
  }

  await sharedExpense.save();

  res.json({
    status: 'success',
    data: sharedExpense
  });
});