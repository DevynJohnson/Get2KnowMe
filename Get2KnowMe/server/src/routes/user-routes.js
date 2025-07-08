
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/auth.js';
import { sendPasswordResetEmail } from '../utils/email.js';

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

// POST Signup route - creates a new user
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  try {
    const { email, username, password, consent } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: 'Email, username, and password are required.' });
    }

    if (
      !consent ||
      consent.ageConfirmed !== true ||
      consent.agreedToTerms !== true
    ) {
      return res.status(400).json({
        message:
          'You must confirm age eligibility and agree to the Terms and Privacy Policy.',
      });
    }

    // Normalize
    req.body.email = email.trim().toLowerCase();
    req.body.username = username.trim().toLowerCase();

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const user = await User.create({
      email,
      username,
      password,
      consent: {
        ...consent,
        ipAddress: ip,
        userAgent: userAgent,
        timestamp: new Date(),
      },
    });

    const token = signToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message =
        field === 'email'
          ? 'This email address is already registered'
          : field === 'username'
          ? 'This username is already taken'
          : 'There was an error creating your account';
      return res.status(400).json({ message });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res
      .status(500)
      .json({ message: 'An error occurred while creating your account' });
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

    // 1. Generate a secure reset token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // 2. Construct reset link (update to your frontend URL)
    const resetLink = `https://get2know.me/reset-password?token=${resetToken}`;

    // 3. Send email using Resend
    try {
      const emailResult = await sendPasswordResetEmail(email, resetLink);
      console.log('sendPasswordResetEmail result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Optionally, you can still return success for security
    }

    console.log(`Password reset requested for: ${email}`);
    res.json({ message: 'If an account with this email exists, a password reset link has been sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing password reset request' });
  }
});

// POST Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    // Find user by reset token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Validate password strength (same as registration)
    if (newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[a-z]/.test(newPassword) ||
        !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password does not meet requirements.' });
    }

    // Set new password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in /reset-password:', error);
    res.status(500).json({ message: 'An error occurred while resetting password.' });
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
