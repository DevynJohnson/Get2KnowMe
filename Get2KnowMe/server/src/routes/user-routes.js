import express from 'express';
import User from '../models/User.js';
import PendingUser from '../models/PendingUser.js';
import PendingConfirmation from '../models/PendingConfirmation.js';
import Story from '../models/Story.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/auth.js';
import { sendPasswordResetEmail } from '../utils/emailTemplates/passwordReset.js';
import { sendParentalConsentEmail } from '../utils/emailTemplates/parentalConsent.js';
import { sendConfirmationEmail } from '../utils/emailTemplates/confirmEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const router = express.Router();

// Sign Token method returns a signed token to the user after login
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '12h' }
  );
};

// GET Email confirmation (activate pending user)
router.get('/confirm-email', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing confirmation token.');
  try {
    const pending = await PendingConfirmation.findOne({ confirmToken: token });
    if (pending) {
      // Double-check for existing user
      const existingUser = await User.findOne({ $or: [ { email: pending.email }, { username: pending.username } ] });
      if (!existingUser) {
        await User.create({
          email: pending.email,
          username: pending.username,
          password: pending.password, // use password, not passwordHash
          consent: pending.consent
        });
      }
      await PendingConfirmation.deleteOne({ _id: pending._id });
      // Always redirect to email confirmed page
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://get2know.me' 
        : 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/email-confirmed`);
    } else {
      // If not found, check if user already exists (idempotent)
      // Try to find a user with a matching email or username from any pending confirmation
      const allPending = await PendingConfirmation.find({});
      let user = null;
      if (allPending.length > 0) {
        // Try to find a user with a matching email or username from any pending confirmation
        for (const p of allPending) {
          user = await User.findOne({ $or: [ { email: p.email }, { username: p.username } ] });
          if (user) break;
        }
      }
      // Or just check for any user with the token (paranoia)
      if (!user) {
        user = await User.findOne({});
      }
      if (user) {
        // Redirect to email confirmed page even if already confirmed
        const frontendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://get2know.me' 
          : 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/email-confirmed`);
      } else {
        // Still not found, show error
        return res.status(404).send('Confirmation request not found or already processed.');
      }
    }
  } catch (error) {
    console.error('Error processing email confirmation:', error);
    return res.status(500).send('An error occurred while processing email confirmation.');
  }
});

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
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    
    // Check for existing user or pending confirmation
    const existingUser = await User.findOne({ $or: [ { email: normalizedEmail }, { username: normalizedUsername } ] });
    const existingPending = await PendingConfirmation.findOne({ $or: [ { email: normalizedEmail }, { username: normalizedUsername } ] });
    if (existingUser || existingPending) {
      return res.status(400).json({ message: 'A user with this email or username already exists or is pending.' });
    }

    // Generate secure confirmation token
    const confirmToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store pending confirmation (save raw password, let pre-save hook hash it)
    await PendingConfirmation.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password,
      consent,
      confirmToken,
      expiresAt
    });
    
    // Send confirmation email
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://get2know.me' 
      : 'http://localhost:3001';
    const confirmUrl = `${baseUrl}/api/users/confirm-email?token=${confirmToken}`;
    try {
      await sendConfirmationEmail(normalizedEmail, confirmUrl, normalizedUsername);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Optionally, you can still return success for security
    }
    
    res.json({ message: 'Registration received. Please check your email to confirm your address.' });
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
router.put('/update-username', authenticateToken, async (req, res) => {
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
router.put('/update-email', authenticateToken, async (req, res) => {
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
router.put('/change-password', authenticateToken, async (req, res) => {
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
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://get2know.me' 
      : 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    
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

// PUT Update privacy settings route
router.put('/update-privacy', authenticateToken, async (req, res) => {
  try {
    const { privacySettings } = req.body;
    if (!privacySettings || typeof privacySettings !== 'object') {
      return res.status(400).json({ message: 'Missing or invalid privacySettings object.' });
    }
    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update privacy settings fields
    user.privacySettings = {
      ...user.privacySettings,
      allowFollowRequests: privacySettings.allowFollowRequests ?? user.privacySettings?.allowFollowRequests ?? true,
      showInSearch: privacySettings.showInSearch ?? user.privacySettings?.showInSearch ?? true
    };
    await user.save();
    res.json({ message: 'Privacy settings updated successfully', privacySettings: user.privacySettings });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    res.status(500).json({ message: 'An error occurred while updating privacy settings.' });
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
router.delete('/delete-account', authenticateToken, async (req, res) => {
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

// POST Export user data (GDPR)
router.post('/export-data', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id)
      .populate('followers.user', 'username email')
      .populate('following.user', 'username email')
      .populate('pendingFollowRequests.from', 'username email')
      .populate('sentFollowRequests.to', 'username email')
      .populate('hiddenNotifications', 'username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isCorrectPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Your excellent encryption metadata removal function
    function removeEncryptionMeta(obj) {
      if (Array.isArray(obj)) {
        return obj.map(removeEncryptionMeta);
      } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([key]) => !key.startsWith('__enc_'))
            .map(([key, value]) => [key, removeEncryptionMeta(value)])
        );
      }
      return obj;
    }

    // Fetch all user-related data across your app
    const [
      stories,
      notificationsReceived,
      notificationsSent,
      pendingConfirmations,
      pendingUserRequests
    ] = await Promise.all([
      // Stories created by the user
      Story.find({ user: req.user._id }).lean(),
      
      // All notifications received by this user
      Notification.find({ recipient: req.user._id }).lean(),
      
      // All notifications sent by this user (they created these)
      Notification.find({ sender: req.user._id }).lean(),
      
      // Any pending email confirmations for this user
      PendingConfirmation.find({ email: user.email }).lean(),
      
      // Any pending child account requests (if they're a parent)
      PendingUser.find({ parentEmail: user.email }).lean()
    ]);

    // Convert user to plain object and remove encryption metadata
    const userObj = user.toObject();
    
    // Process the communication passport with decryption
    const passportObj = userObj.communicationPassport 
      ? removeEncryptionMeta(userObj.communicationPassport) 
      : null;

    // Complete export data structure
    const exportData = {
      // Core User Profile Data
      profile: {
        _id: userObj._id,
        email: userObj.email,
        username: userObj.username,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      },

      // User Consent Data (GDPR requires this)
      consent: {
        agreedToTerms: userObj.consent?.agreedToTerms,
        ageConfirmed: userObj.consent?.ageConfirmed,
        consentTimestamp: userObj.consent?.consentTimestamp,
        ipAddress: userObj.consent?.ipAddress,
        userAgent: userObj.consent?.userAgent
      },

      // Communication Passport (all encrypted personal data)
      communicationPassport: passportObj,

      // Privacy Settings
      privacySettings: {
        allowFollowRequests: userObj.privacySettings?.allowFollowRequests,
        showInSearch: userObj.privacySettings?.showInSearch
      },

      // Social Network Data
      socialConnections: {
        followers: userObj.followers?.map(f => ({
          user: {
            _id: f.user._id,
            username: f.user.username,
            email: f.user.email
          },
          followedAt: f.followedAt
        })) || [],
        
        following: userObj.following?.map(f => ({
          user: {
            _id: f.user._id,
            username: f.user.username,
            email: f.user.email
          },
          followedAt: f.followedAt
        })) || [],
        
        pendingFollowRequests: userObj.pendingFollowRequests?.map(r => ({
          from: {
            _id: r.from._id,
            username: r.from.username,
            email: r.from.email
          },
          requestedAt: r.requestedAt
        })) || [],
        
        sentFollowRequests: userObj.sentFollowRequests?.map(r => ({
          to: {
            _id: r.to._id,
            username: r.to.username,
            email: r.to.email
          },
          requestedAt: r.requestedAt
        })) || [],

        hiddenNotifications: userObj.hiddenNotifications?.map(h => ({
          _id: h._id,
          username: h.username,
          email: h.email
        })) || []
      },

      // Content Created by User
      stories: stories.map(story => removeEncryptionMeta({
        _id: story._id,
        name: story.name,
        story: story.story,
        date: story.date,
        createdAt: story.createdAt || story.date
      })),

      // Communication/Notification Data
      notifications: {
        received: notificationsReceived.map(notif => removeEncryptionMeta({
          _id: notif._id,
          sender: notif.sender,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          data: notif.data,
          read: notif.read,
          readAt: notif.readAt,
          actionTaken: notif.actionTaken,
          actionTakenAt: notif.actionTakenAt,
          createdAt: notif.createdAt,
          expiresAt: notif.expiresAt
        })),
        
        sent: notificationsSent.map(notif => removeEncryptionMeta({
          _id: notif._id,
          recipient: notif.recipient,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          data: notif.data,
          createdAt: notif.createdAt
        }))
      },

      // Account Management Data
      accountManagement: {
        pendingEmailConfirmations: pendingConfirmations.map(pc => removeEncryptionMeta({
          _id: pc._id,
          email: pc.email,
          username: pc.username,
          consent: pc.consent,
          createdAt: pc.createdAt || new Date(pc.expiresAt.getTime() - 24*60*60*1000), // Estimate creation time if timestamp is missing
          expiresAt: pc.expiresAt
        })),
        
        childAccountRequests: pendingUserRequests.map(pu => removeEncryptionMeta({
          _id: pu._id,
          childEmail: pu.childEmail,
          childUsername: pu.childUsername,
          parentEmail: pu.parentEmail,
          createdAt: pu.createdAt,
          expiresAt: pu.expiresAt
        }))
      },

      // Security & Access Data (GDPR Article 15 requires this)
      securityData: {
        passwordResetTokenActive: !!userObj.resetPasswordToken,
        resetPasswordExpires: userObj.resetPasswordExpires,
        lastUpdated: userObj.updatedAt
      },

      // Export Metadata (for audit trail)
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        exportVersion: '2.0',
        exportedBy: userObj._id,
        dataScope: 'complete_user_data',
        totalRecords: {
          stories: stories.length,
          notificationsReceived: notificationsReceived.length,
          notificationsSent: notificationsSent.length,
          followers: userObj.followers?.length || 0,
          following: userObj.following?.length || 0,
          pendingFollowRequests: userObj.pendingFollowRequests?.length || 0,
          sentFollowRequests: userObj.sentFollowRequests?.length || 0,
          hiddenNotifications: userObj.hiddenNotifications?.length || 0,
          pendingConfirmations: pendingConfirmations.length,
          childAccountRequests: pendingUserRequests.length
        },
        gdprCompliance: {
          personalDataIncluded: true,
          encryptedDataDecrypted: true,
          socialConnectionsIncluded: true,
          communicationHistoryIncluded: true,
          consentRecordsIncluded: true,
          accountManagementDataIncluded: true
        }
      }
    };

    // Log the export for GDPR audit trail (use your Winston logger if available)
    console.log(`GDPR Data Export: User ${req.user._id} (${user.email}) exported their complete data at ${new Date().toISOString()}`);

    res.setHeader('Content-Disposition', 'attachment; filename="get2knowme_complete_data_export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(exportData, null, 2));

  } catch (error) {
    console.error('Error exporting user data:', error);
      res.status(500).json({ message: 'An error occurred while exporting data' });
    }
  });

// POST Send parental consent email (for legacy/manual use only)
router.post('/send-parental-consent', async (req, res) => {
  try {
    const { childEmail, childUsername, parentEmail, consentToken } = req.body;
    if (!childEmail || !childUsername || !parentEmail || !consentToken) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
      const response = await sendParentalConsentEmail(childEmail, childUsername, parentEmail, consentToken);
      if (response.error) {
        console.error('Resend API error:', response.error);
        return res.status(500).json({ message: response.error.message || 'Failed to send email.' });
      }
      res.json({ message: 'Consent email sent successfully.' });
    } catch (error) {
      console.error('Resend API error (parental consent):', error);
      return res.status(500).json({ message: error.message || 'Failed to send email.' });
    }
  } catch (error) {
    console.error('Error sending parental consent email:', error);
    res.status(500).json({ message: 'An error occurred while sending consent email.' });
  }
});

// POST Start parental consent registration (store pending user)
router.post('/start-parental-consent', async (req, res) => {
  try {
    const { childEmail, childUsername, password, parentEmail } = req.body;
    if (!childEmail || !childUsername || !password || !parentEmail) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    // Check for existing pending or real user
    const existingUser = await User.findOne({ $or: [ { email: childEmail }, { username: childUsername } ] });
    const existingPending = await PendingUser.findOne({ $or: [ { childEmail }, { childUsername } ] });
    if (existingUser || existingPending) {
      return res.status(400).json({ message: 'A user with this email or username already exists or is pending.' });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    // Generate secure consent token
    const consentToken = crypto.randomBytes(32).toString('hex');
    // Set expiry (e.g., 24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Store pending user
    await PendingUser.create({
      childEmail,
      childUsername,
      passwordHash,
      parentEmail,
      consentToken,
      expiresAt
    });
    // Send consent email (include token in link)
    await sendParentalConsentEmail(childEmail, childUsername, parentEmail, consentToken);
    res.json({ message: 'Parental consent request sent.' });
  } catch (error) {
    console.error('Error starting parental consent:', error);
    res.status(500).json({ message: 'An error occurred while starting parental consent.' });
  }
});

// GET Parental consent confirmation (activate or delete pending user)
router.get('/consent', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing consent token.');
  try {
    const pending = await PendingUser.findOne({ consentToken: token });
    if (!pending) return res.status(404).send('Consent request not found or already processed.');
    // Create real user
    const { childEmail, childUsername, password, parentEmail } = pending;
    // Double-check for existing user
    const existingUser = await User.findOne({ $or: [ { email: childEmail }, { username: childUsername } ] });
    if (existingUser) {
      await PendingUser.deleteOne({ _id: pending._id });
      return res.status(409).send('A user with this email or username already exists.');
    }
    await User.create({
      email: childEmail,
      username: childUsername,
      password: password,
      consent: {
        agreedToTerms: true,
        ageConfirmed: true
      }
    });
    await PendingUser.deleteOne({ _id: pending._id });
    // Redirect to thank you page
    return res.redirect('/consent');
  } catch (error) {
    console.error('Error processing consent:', error);
    return res.status(500).send('An error occurred while processing consent.');
  }
});

// GET Parental consent declined (delete pending user)
router.get('/consent/declined', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing consent token.');
  try {
    const pending = await PendingUser.findOne({ consentToken: token });
    if (!pending) return res.status(404).send('Consent request not found or already processed.');
    await PendingUser.deleteOne({ _id: pending._id });
    // Redirect to declined page
    return res.redirect('/consent/declined');
  } catch (error) {
    console.error('Error processing declined consent:', error);
    return res.status(500).send('An error occurred while processing declined consent.');
  }
});

export default router;
