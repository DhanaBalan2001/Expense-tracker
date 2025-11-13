import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register User
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Normalize email to lowercase for case-insensitive login
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user (password is hashed in the model automatically)
    const user = await User.create({
      username,
      email: normalizedEmail,
      password // No manual hashing here
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '7d' });

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Find user and ensure password is retrieved
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '7d' });

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Logout User
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      token: null,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
