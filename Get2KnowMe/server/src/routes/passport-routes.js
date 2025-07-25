// server/src/routes/passport-routes.js
import express from 'express';
import { validatePassportData } from '../middleware/passportValidator.js';
import { normalizePhoneNumber } from '../utils/phoneNormalization.js';
import User from '../models/User.js';
import { generateFriendlyPasscode, validatePasscode } from '../utils/passcodeGenerator.js';
import { authenticateToken } from '../utils/auth.js';
import { passportUpdateMiddleware } from '../middleware/passportTracking.js';

const router = express.Router();

// GET /api/passport/generate-passcode - Generate a new passcode
router.get('/generate-passcode', (req, res) => {
  try {
    const passcode = generateFriendlyPasscode();
    return res.json({ passcode });
  } catch (error) {
    console.error('Error generating passcode:', error);
    return res.status(500).json({ message: 'Error generating passcode' });
  }
});

// POST /api/passport/create - Create or update communication passport (protected route)
// Added passportUpdateMiddleware to track changes and notify followers
router.post('/create', authenticateToken, passportUpdateMiddleware, validatePassportData, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticateTokenMiddleware sets req.user

    const passportData = req.body;

    // Clean and normalize the passcode
    const cleanPasscode = passportData.profilePasscode.replace(/-/g, '').toUpperCase();

    // Check passcode uniqueness
    const existingPasscode = await User.findOne({
      'communicationPassport.profilePasscode': cleanPasscode,
      _id: { $ne: userId }
    });
    if (existingPasscode) {
      return res.status(400).json({
        message: 'This passcode is already in use. Please choose a different one.'
      });
    }

    // Normalize the trusted contact phone number
    const normalizedPhone = normalizePhoneNumber(passportData.trustedContact.phone, passportData.trustedContact.countryCode);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Failed to normalize trusted contact phone number.' });
    }
    passportData.trustedContact.phone = normalizedPhone;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          communicationPassport: {
            ...passportData,
            profilePasscode: cleanPasscode,
            updatedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Notify all followers of passport update
    try {
      const userWithFollowers = await User.findById(userId).select('followers username communicationPassport.profilePasscode');
      const passcode = updatedUser.communicationPassport?.profilePasscode;
      console.log('[Passport Update] Notifying followers:', {
        userId,
        username: updatedUser.username,
        passcode,
        followers: userWithFollowers?.followers?.length
      });
      if (userWithFollowers && userWithFollowers.followers && userWithFollowers.followers.length > 0 && passcode) {
        const Notification = (await import('../models/Notification.js')).default;
        const notifications = userWithFollowers.followers.map(followerObj => ({
          recipient: followerObj.user,
          sender: userId,
          type: 'passport_update',
          title: 'Communication Passport Updated',
          message: `${updatedUser.username} has updated their Communication Passport.`,
          data: { passcode },
          createdAt: new Date()
        }));
        console.log('[Passport Update] Creating notifications:', notifications);
        await Notification.insertMany(notifications);
        console.log('[Passport Update] Notifications inserted successfully');
      } else {
        console.warn('[Passport Update] No followers to notify or missing passcode.');
      }
    } catch (notifyErr) {
      console.error('Error sending passport update notifications:', notifyErr);
      // Don't block user update on notification failure
    }

    return res.json({
      message: 'Communication passport saved successfully',
      passport: updatedUser.communicationPassport
    });

  } catch (error) {
    console.error('Error creating communication passport:', error);
    return res.status(500).json({ message: 'Error saving communication passport' });
  }
});

// GET /api/passport/my-passport - Get current user's communication passport (protected route)
router.get('/my-passport', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.status(404).json({ message: 'User not found' });
    if (!foundUser.communicationPassport) return res.status(404).json({ message: 'Communication passport not found' });
    return res.json({ passport: foundUser.communicationPassport });
  } catch (error) {
    console.error('Error fetching communication passport:', error);
    return res.status(500).json({ message: 'Error fetching communication passport' });
  }
});

// GET /api/passport/public/:passcode - Get communication passport by passcode (public route)
router.get('/public/:passcode', async (req, res) => {
  try {
    const { passcode } = req.params;

    // Clean passcode (remove dashes, convert to uppercase)
    const cleanPasscode = passcode.replace(/-/g, '').toUpperCase();

    let user = await User.findOne({
      'communicationPassport.profilePasscode': cleanPasscode,
      'communicationPassport.isActive': { $ne: false }
    });

    if (!user) {
      user = await User.findOne({
        'communicationPassport.profilePasscode': passcode,
        'communicationPassport.isActive': { $ne: false }
      });
    }

    if (!user || !user.communicationPassport) {
      return res.status(404).json({ message: 'Communication passport not found' });
    }

    const publicPassport = {
      firstName: user.communicationPassport.firstName,
      lastName: user.communicationPassport.lastName,
      preferredName: user.communicationPassport.preferredName,
      preferredPronouns: user.communicationPassport.preferredPronouns,
      customPronouns: user.communicationPassport.customPronouns,
      diagnoses: user.communicationPassport.diagnoses,
      customDiagnosis: user.communicationPassport.customDiagnosis,
      healthAlert: user.communicationPassport.healthAlert,
      customHealthAlert: user.communicationPassport.customHealthAlert,
      allergyList: user.communicationPassport.allergyList,
      triggers: user.communicationPassport.triggers,
      likes: user.communicationPassport.likes,
      dislikes: user.communicationPassport.dislikes,
      communicationPreferences: user.communicationPassport.communicationPreferences,
      customPreferences: user.communicationPassport.customPreferences,
      trustedContact: user.communicationPassport.trustedContact,
      otherInformation: user.communicationPassport.otherInformation,
      updatedAt: user.communicationPassport.updatedAt
    };

    return res.json({ passport: publicPassport });

  } catch (error) {
    console.error('Error fetching public communication passport:', error);
    return res.status(500).json({ message: 'Error fetching communication passport' });
  }
});

// DELETE /api/passport/delete - Delete communication passport (protected route)
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { communicationPassport: "" } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'Communication passport deleted successfully' });
  } catch (error) {
    console.error('Error deleting communication passport:', error);
    return res.status(500).json({ message: 'Error deleting communication passport' });
  }
});

export default router;