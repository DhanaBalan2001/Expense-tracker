import mongoose from 'mongoose';

const sharedExpenseSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    share: Number,
    paid: {
      type: Boolean,
      default: false
    }
  }],
  splitType: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal'
  },
  status: {
    type: String,
    enum: ['pending', 'settled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('SharedExpense', sharedExpenseSchema);
