// server/src/routes/passport-routes.js
import express from 'express';
import User from '../models/User.js';
import { generateFriendlyPasscode, validatePasscode } from '../utils/passcodeGenerator.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// GET /api/passport/generate-passcode - Generate a new passcode
router.get('/generate-passcode', (req, res) => {
  try {
    const passcode = generateFriendlyPasscode();
    res.json({ passcode });
  } catch (error) {
    console.error('Error generating passcode:', error);
    res.status(500).json({ message: 'Error generating passcode' });
  }
});

// POST /api/passport/create - Create or update communication passport (protected route)
router.post('/create', async (req, res) => {
  try {
    // Extract user from token
    const authResult = authenticateToken(req);
    if (!authResult.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = authResult.user._id;
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

    res.json({ 
      message: 'Communication passport saved successfully',
      passport: updatedUser.communicationPassport
    });

  } catch (error) {
    console.error('Error creating communication passport:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    
    res.status(500).json({ message: 'Error saving communication passport' });
  }
});

// GET /api/passport/my-passport - Get current user's communication passport (protected route)
router.get('/my-passport', async (req, res) => {
  try {
    const authResult = authenticateToken(req);
    if (!authResult.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(authResult.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.communicationPassport) {
      return res.status(404).json({ message: 'Communication passport not found' });
    }

    res.json({ passport: user.communicationPassport });

  } catch (error) {
    console.error('Error fetching communication passport:', error);
    res.status(500).json({ message: 'Error fetching communication passport' });
  }
});

// GET /api/passport/public/:passcode - Get communication passport by passcode (public route)
router.get('/public/:passcode', async (req, res) => {
  try {
    const { passcode } = req.params;

    // Clean passcode (remove dashes, convert to uppercase)
    const cleanPasscode = passcode.replace(/-/g, '').toUpperCase();

    // Try to find user with either cleaned passcode or original format
    let user = await User.findOne({
      'communicationPassport.profilePasscode': cleanPasscode,
      'communicationPassport.isActive': { $ne: false } // Handle undefined as true
    });

    // If not found with cleaned version, try original format (for backwards compatibility)
    if (!user) {
      user = await User.findOne({
        'communicationPassport.profilePasscode': passcode,
        'communicationPassport.isActive': { $ne: false } // Handle undefined as true
      });
    }

    if (!user || !user.communicationPassport) {
      return res.status(404).json({ message: 'Communication passport not found' });
    }

    // Return only the communication passport data (no sensitive user info)
    const publicPassport = {
      firstName: user.communicationPassport.firstName,
      lastName: user.communicationPassport.lastName,
      preferredName: user.communicationPassport.preferredName,
      diagnosis: user.communicationPassport.diagnosis,
      customDiagnosis: user.communicationPassport.customDiagnosis,
      communicationPreferences: user.communicationPassport.communicationPreferences,
      avoidWords: user.communicationPassport.avoidWords,
      customPreferences: user.communicationPassport.customPreferences,
      trustedContact: user.communicationPassport.trustedContact,
      otherInformation: user.communicationPassport.otherInformation,
      updatedAt: user.communicationPassport.updatedAt
    };

    res.json({ passport: publicPassport });

  } catch (error) {
    console.error('Error fetching public communication passport:', error);
    res.status(500).json({ message: 'Error fetching communication passport' });
  }
});

// DELETE /api/passport/delete - Delete communication passport (protected route)
router.delete('/delete', async (req, res) => {
  try {
    const authResult = authenticateToken(req);
    if (!authResult.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      authResult.user._id,
      { $unset: { communicationPassport: "" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Communication passport deleted successfully' });

  } catch (error) {
    console.error('Error deleting communication passport:', error);
    res.status(500).json({ message: 'Error deleting communication passport' });
  }
});

export default router;
