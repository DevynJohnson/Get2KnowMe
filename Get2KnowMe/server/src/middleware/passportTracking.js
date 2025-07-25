import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Fields to track for changes (excluding sensitive data)
const TRACKED_FIELDS = [
  'communicationPassport.preferredName',
  'communicationPassport.preferredPronouns',
  'communicationPassport.customPronouns',
  'communicationPassport.diagnoses',
  'communicationPassport.customDiagnosis',
  'communicationPassport.healthAlert',
  'communicationPassport.customHealthAlert',
  'communicationPassport.allergyList',
  'communicationPassport.communicationPreferences',
  'communicationPassport.customPreferences',
  'communicationPassport.triggers',
  'communicationPassport.likes',
  'communicationPassport.dislikes',
  'communicationPassport.otherInformation'
];

// Human-readable field names
const FIELD_NAMES = {
  'communicationPassport.preferredName': 'Preferred Name',
  'communicationPassport.preferredPronouns': 'Preferred Pronouns',
  'communicationPassport.customPronouns': 'Custom Pronouns',
  'communicationPassport.diagnoses': 'Diagnoses',
  'communicationPassport.customDiagnosis': 'Custom Diagnosis',
  'communicationPassport.healthAlert': 'Health Alerts',
  'communicationPassport.customHealthAlert': 'Custom Health Alert',
  'communicationPassport.allergyList': 'Allergies',
  'communicationPassport.communicationPreferences': 'Communication Preferences',
  'communicationPassport.customPreferences': 'Custom Preferences',
  'communicationPassport.triggers': 'Triggers',
  'communicationPassport.likes': 'Likes',
  'communicationPassport.dislikes': 'Dislikes',
  'communicationPassport.otherInformation': 'Other Information'
};

// Helper function to get nested value from object
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Helper function to format value for display
function formatValue(value) {
  if (value === null || value === undefined) {
    return 'Not specified';
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'None';
  }
  if (typeof value === 'string') {
    return value.trim() || 'Not specified';
  }
  return String(value);
}

// Helper function to compare values
function valuesAreEqual(oldValue, newValue) {
  // Handle arrays
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length !== newValue.length) return false;
    return oldValue.every((item, index) => item === newValue[index]);
  }
  
  // Handle null/undefined
  if ((oldValue === null || oldValue === undefined) && 
      (newValue === null || newValue === undefined)) {
    return true;
  }
  
  // Handle strings (trim whitespace)
  if (typeof oldValue === 'string' && typeof newValue === 'string') {
    return oldValue.trim() === newValue.trim();
  }
  
  return oldValue === newValue;
}

// Middleware to track Communication Passport changes
export const trackPassportChanges = async (req, res, next) => {
  try {
    // Only track changes for passport updates
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return next();
    }

    // Get the original user data before update
    const originalUser = await User.findById(req.user._id).lean();
    if (!originalUser) {
      return next();
    }

    // Store original data in request for later comparison
    req.originalUserData = originalUser;
    
    next();
  } catch (error) {
    console.error('Error in trackPassportChanges middleware:', error);
    next();
  }
};

// Middleware to detect changes and send notifications
export const notifyPassportChanges = async (req, res, next) => {
  // Execute the original response first
  const originalSend = res.json;
  
  res.json = function(data) {
    // Call original response
    originalSend.call(this, data);
    
    // Then handle notifications asynchronously
    if (req.originalUserData && res.statusCode < 400) {
      detectAndNotifyChanges(req.user._id, req.originalUserData)
        .catch(error => {
          console.error('Error sending passport change notifications:', error);
        });
    }
  };
  
  next();
};

// Function to detect changes and send notifications
async function detectAndNotifyChanges(userId, originalUserData) {
  try {
    // Get updated user data
    const updatedUser = await User.findById(userId).lean();
    if (!updatedUser) return;

    const changes = [];

    // Check each tracked field for changes
    for (const fieldPath of TRACKED_FIELDS) {
      const oldValue = getNestedValue(originalUserData, fieldPath);
      const newValue = getNestedValue(updatedUser, fieldPath);

      if (!valuesAreEqual(oldValue, newValue)) {
        changes.push({
          field: FIELD_NAMES[fieldPath] || fieldPath,
          oldValue: formatValue(oldValue),
          newValue: formatValue(newValue)
        });
      }
    }

    // If there are changes, notify followers
    if (changes.length > 0) {
      console.log(`Detected ${changes.length} passport changes for user ${userId}`);
      await Notification.createPassportUpdateNotification(userId, changes);
    }

  } catch (error) {
    console.error('Error in detectAndNotifyChanges:', error);
  }
}

// Middleware for passport update routes
export const passportUpdateMiddleware = [trackPassportChanges, notifyPassportChanges];

// Manual function to trigger notifications (for testing or manual triggers)
export const triggerPassportUpdateNotifications = async (userId, changes = []) => {
  try {
    await Notification.createPassportUpdateNotification(userId, changes);
    console.log(`Manual passport update notifications sent for user ${userId}`);
  } catch (error) {
    console.error('Error triggering passport update notifications:', error);
    throw error;
  }
};