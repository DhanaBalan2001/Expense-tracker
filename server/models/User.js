import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  settings: {
    currency: { type: String, default: 'USD' },
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      billReminders: { type: Boolean, default: true }
    },
    defaultView: { type: String, default: 'monthly' }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model('User', userSchema);