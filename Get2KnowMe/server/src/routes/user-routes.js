import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Sign Token method returns a signed token to the user after login
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
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

export default router;
