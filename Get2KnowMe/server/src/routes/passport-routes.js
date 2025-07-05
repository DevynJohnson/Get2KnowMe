// server/src/routes/passport-routes.js
import express from 'express';
import User from '../models/User.js';
import { generateFriendlyPasscode, validatePasscode } from '../utils/passcodeGenerator.js';
import { authenticateToken } from '../utils/auth.js';
import { validateInternationalPhone } from '../utils/phoneValidation.js';

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
router.post('/create', async (req, res) => {
  try {
    const { user } = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = user._id;
    const passportData = req.body;

    // Validate passcode format
    if (!validatePasscode(passportData.profilePasscode)) {
      return res.status(400).json({
        message: 'Invalid passcode format. Use 6-20 alphanumeric characters.'
      });
    }

    // Clean and normalize the passcode before storing (remove dashes, uppercase)
    const cleanPasscode = passportData.profilePasscode.replace(/-/g, '').toUpperCase();

    // Check if passcode is already in use by another user
    const existingPasscode = await User.findOne({
      'communicationPassport.profilePasscode': cleanPasscode,
      _id: { $ne: userId }
    });

    if (existingPasscode) {
      return res.status(400).json({
        message: 'This passcode is already in use. Please choose a different one.'
      });
    }

    // Required fields except trustedContact (which is an object)
    const requiredFields = ['firstName', 'lastName', 'diagnoses', 'profilePasscode'];
    for (const field of requiredFields) {
      if (!passportData[field] || (Array.isArray(passportData[field]) && passportData[field].length === 0)) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Validate trustedContact subfields
    if (!passportData.trustedContact
      || !passportData.trustedContact.name
      || !passportData.trustedContact.phone
      || !passportData.trustedContact.countryCode) {
      return res.status(400).json({ message: 'Trusted contact name, phone, and country code are required.' });
    }

    // Validate trusted contact phone number format (international)
    if (!validateInternationalPhone(passportData.trustedContact.phone, passportData.trustedContact.countryCode)) {
      return res.status(400).json({ message: 'Trusted contact phone number is invalid for the selected country.' });
    }

    // Conditional validation for custom diagnosis
    if (passportData.diagnoses.includes('Other') && !passportData.customDiagnosis) {
      return res.status(400).json({ message: 'Please specify your diagnosis.' });
    }

    // Update user with communication passport data (store cleaned passcode)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          communicationPassport: {
            ...passportData,
            profilePasscode: cleanPasscode, // Store the cleaned version
            updatedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Communication passport saved successfully',
      passport: updatedUser.communicationPassport
    });

  } catch (error) {
    console.error('Error creating communication passport:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    return res.status(500).json({ message: 'Error saving communication passport' });
  }
});

// GET /api/passport/my-passport - Get current user's communication passport (protected route)
router.get('/my-passport', async (req, res) => {
  try {
    const { user } = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const foundUser = await User.findById(user._id);
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!foundUser.communicationPassport) {
      return res.status(404).json({ message: 'Communication passport not found' });
    }

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
      diagnosis: user.communicationPassport.diagnosis,
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
router.delete('/delete', async (req, res) => {
  try {
    const { user } = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $unset: { communicationPassport: "" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Communication passport deleted successfully' });

  } catch (error) {
    console.error('Error deleting communication passport:', error);
    return res.status(500).json({ message: 'Error deleting communication passport' });
  }
});

export default router;
