import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['monthly', 'category', 'custom'],
    required: true
  },
  dateRange: {
    start: Date,
    end: Date
  },
  data: mongoose.Schema.Types.Mixed,
  format: {
    type: String,
    enum: ['pdf', 'excel'],
    default: 'pdf'
  }
}, {
  timestamps: true
});

export default mongoose.model('Report', reportSchema);
