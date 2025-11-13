import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  userId: {
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
  dueDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  recurring: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paidDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Bill', BillSchema);
