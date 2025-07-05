// server/utils/phoneValidation.js
import { isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validates a phone number using libphonenumber-js
 * @param {string} phone - The phone number to validate
 * @param {string} countryCode - The country code (e.g., 'US', 'GB')
 * @returns {boolean}
 */
export function validateInternationalPhone(phone, countryCode) {
  if (!phone || !countryCode) return false;
  try {
    return isValidPhoneNumber(phone, countryCode);
  } catch (e) {
    return false;
  }
}
