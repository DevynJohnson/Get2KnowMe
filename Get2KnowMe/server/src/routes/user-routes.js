import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Sign Token method returns a signed token to the user after login
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

// Middleware to authenticate and extract user from token
const authenticate = (req, res, next) => {
  const authResult = authenticateToken(req);
  if (!authResult.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  req.user = authResult.user;
  next();
};

// POST Login route - login existing user
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Check if emailOrUsername is an email (contains @) or username
    const isEmail = emailOrUsername.includes('@');
    const query = isEmail 
      ? { email: emailOrUsername }
      : { username: emailOrUsername };
    
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ 
        message: isEmail ? 'Email not found' : 'Username not found' 
      });
    }

    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = signToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Post Signup route - creates a new user
router.post('/signup', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Handle duplicate key error (MongoDB error code for unique constraint violation)
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' 
        ? 'This email address is already registered' 
        : field === 'username' 
        ? 'This username is already taken' 
        : 'This account information is already in use';
      return res.status(400).json({ message });
    }
    if (error.name === 'ValidationError') {
      // Handle validation errors (like password requirements)
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'An error occurred while creating your account' });
  }
});

// PUT Update username route
router.put('/update-username', authenticate, async (req, res) => {
  try {
    const { currentPassword, username } = req.body;
    
    if (!currentPassword || !username) {
      return res.status(400).json({ message: 'Current password and new username are required' });
    }

    // Find the user and verify password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isCorrectPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Update username
    user.username = username;
    await user.save();

    // Create new token with updated username
    const token = signToken(user);

    res.json({ 
      message: 'Username updated successfully',
      token,
      user: { _id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating username' });
  }
});

// PUT Update email route
router.put('/update-email', authenticate, async (req, res) => {
  try {
    const { currentPassword, email } = req.body;
    
    if (!currentPassword || !email) {
      return res.status(400).json({ message: 'Current password and new email are required' });
    }

    // Find the user and verify password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isCorrectPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Update email
    user.email = email;
    await user.save();

    // Create new token with updated email
    const token = signToken(user);

    res.json({ 
      message: 'Email updated successfully',
      token,
      user: { _id: user._id, email: user.email, username: user.username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating email' });
  }
});

// PUT Change password route
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Find the user and verify current password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isCorrectPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'An error occurred while changing password' });
  }
});

// POST Request password reset route
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent' });
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it with expiration time
    // 3. Send email with reset link
    // For now, we'll just return a success message
    
    console.log(`Password reset requested for: ${email}`);
    res.json({ message: 'If an account with this email exists, a password reset link has been sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing password reset request' });
  }
});

// DELETE Account deletion route
router.delete('/delete-account', authenticate, async (req, res) => {
  try {
    const { password, confirmText } = req.body;
    
    if (!password || confirmText !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({ message: 'Password and confirmation text are required' });
    }

    // Find the user and verify password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isCorrectPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting account' });
  }
});

export default router;
