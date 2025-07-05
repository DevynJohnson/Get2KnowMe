import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizePhoneNumber(phone, countryCode) {
  if (!phone) return null;

  try {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.format('E.164'); // standard international format
    }
  } catch (error) {
    console.warn('Phone normalization error:', error);
  }

  return null;
}
/**
 * Normalizes a phone number to E.164 format for storage and validation.
 * This function will:
 * - Parse the phone number using the provided country code
 * - Return the normalized E.164 format if valid
 * - Return null if parsing fails or number is invalid
 *
 * @param {string} phone - The raw phone number input
 * @param {string} countryCode - The ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
 * @returns {string|null} - Normalized phone number in E.164 format or null if invalid
 */