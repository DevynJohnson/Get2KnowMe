// client/utils/phoneUtils.js
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Formats a phone number for international display
 * @param {string} phoneNumber - The phone number to format
 * @param {string} [country='GB'] - Optional default country code for parsing
 * @returns {string} - Formatted phone number or original if formatting fails
 */
export const formatPhoneForDisplay = (phoneNumber, country = 'GB') => {
  if (!phoneNumber) return '';

  try {
    const parsed = parsePhoneNumber(phoneNumber, country);
    return parsed.formatInternational();
  } catch (error) {
    console.warn('Error formatting phone number:', error);
    return phoneNumber; // Return original if formatting fails
  }
};

/**
 * Validates a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} [country] - Optional country code (e.g., 'GB', 'US')
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhoneNumber = (phoneNumber, country) => {
  if (!phoneNumber) return false;

  try {
    // Pass country code if provided
    return isValidPhoneNumber(phoneNumber, country);
  } catch (error) {
    console.warn('Error validating phone number:', error);
    return false;
  }
};

/**
 * Parses a phone number and returns formatted components
 * @param {string} phoneNumber - The phone number to parse
 * @param {string} [country='GB'] - Optional default country code for parsing
 * @returns {object|null} - Object with country, national number, and international format, or null if parsing fails
 */
export const parsePhoneNumberDetails = (phoneNumber, country = 'GB') => {
  if (!phoneNumber) return null;

  try {
    const parsed = parsePhoneNumber(phoneNumber, country);
    return {
      country: parsed.country,
      countryCallingCode: parsed.countryCallingCode,
      nationalNumber: parsed.nationalNumber,
      international: parsed.formatInternational(),
      national: parsed.formatNational(),
    };
  } catch (error) {
    console.warn('Error parsing phone number:', error);
    return null;
  }
};

/**
 * Creates a tel: link for phone numbers
 * @param {string} phoneNumber - The phone number
 * @param {string} [country='GB'] - Optional default country code for parsing
 * @returns {string} - Tel link formatted phone number
 */
export const createPhoneLink = (phoneNumber, country = 'GB') => {
  if (!phoneNumber) return '';

  try {
    const parsed = parsePhoneNumber(phoneNumber, country);
    return `tel:${parsed.number}`;
  } catch {
    // If parsing fails, clean the number manually
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    return `tel:${cleaned.startsWith('+') ? cleaned : `+${cleaned}`}`;
  }
};
