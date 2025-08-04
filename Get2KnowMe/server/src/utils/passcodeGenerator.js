// server/src/utils/passcodeGenerator.js
import crypto from 'crypto';

/**
 * Generates a random alphanumeric passcode
 * @param {number} length - Length of the passcode (default: 8)
 * @returns {string} - Generated passcode
 */
export const generatePasscode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    result += characters[randomIndex];
  }
  
  return result;
};

/**
 * Generates a user-friendly passcode with separators
 * @param {number} groups - Number of character groups (default: 2)
 * @param {number} groupLength - Characters per group (default: 4)
 * @returns {string} - Generated passcode with dashes (e.g., "AB12-CD34")
 */
export const generateFriendlyPasscode = (groups = 2, groupLength = 4) => {
  const passcodeGroups = [];
  
  for (let i = 0; i < groups; i++) {
    passcodeGroups.push(generatePasscode(groupLength));
  }
  
  return passcodeGroups.join('-');
};

/**
 * Validates passcode format
 * @param {string} passcode - Passcode to validate
 * @returns {boolean} - True if valid format
 */
export const validatePasscode = (passcode) => {
  // Check if passcode is a valid string first
  if (!passcode || typeof passcode !== 'string') {
    return false;
  }
  // Remove dashes and check if alphanumeric (case-insensitive)
  const cleanPasscode = passcode.replace(/-/g, '').toUpperCase();
  return /^[A-Z0-9]{6,20}$/.test(cleanPasscode);
};

export default {
  generatePasscode,
  generateFriendlyPasscode,
  validatePasscode
};
