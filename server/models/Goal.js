import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Goal', goalSchema);
