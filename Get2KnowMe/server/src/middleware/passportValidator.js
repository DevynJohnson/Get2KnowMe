import { validatePasscode } from '../utils/passcodeGenerator.js';
import { validateInternationalPhone } from '../utils/phoneValidation.js';

const diagnosisOptions = [
  "ASD (Autism Spectrum Disorder)",
  "ADHD",
  "OCD",
  "Dyslexia",
  "Dyscalculia",
  "Tourette's Syndrome",
  "C-PTSD (Complex PTSD)",
  "Anxiety",
  "No Diagnosis",
  "Other",
];

const healthAlertOptions = [
  "None",
  "Type 1 Diabetes",
  "Type 2 Diabetes",
  "Epilepsy",
  "Allergies",
  "Other",
];

const communicationPreferenceOptions = [
  "I will understand things better if you speak slowly",
  "I may need extra time to process when you are speaking to me, it may take me a moment to respond",
  "Please avoid complicated questions or confusing language",
  "I do not enjoy physical contact, please do not touch me",
  "Please use gestures and non-verbal cues if possible, they help me understand better",
  "Reading can take me some time, please be patient and allow me time to process the information",
  "Other",
];

// Helper: sanitize string inputs (simple trim here, extend as needed)
const sanitizeString = (str) => (typeof str === 'string' ? str.trim() : '');

export function validatePassportData(req, res, next) {
  const data = req.body;

  // Required fields presence check
  const requiredFields = ['firstName', 'lastName', 'diagnoses', 'profilePasscode'];
  for (const field of requiredFields) {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      return res.status(400).json({ message: `Missing required field: ${field}` });
    }
  }

  // Passcode format
  if (!validatePasscode(data.profilePasscode)) {
    return res.status(400).json({
      message: 'Invalid passcode format. Use 6-20 alphanumeric characters.',
    });
  }

  // Validate diagnoses array values
  if (!Array.isArray(data.diagnoses)) {
    return res.status(400).json({ message: 'Diagnoses must be an array' });
  }
  const invalidDiagnosis = data.diagnoses.find(
    (d) => !diagnosisOptions.includes(d)
  );
  if (invalidDiagnosis) {
    return res.status(400).json({ message: `Invalid diagnosis option: ${invalidDiagnosis}` });
  }

  // If "Other" selected, customDiagnosis is required
  if (data.diagnoses.includes('Other')) {
    if (!sanitizeString(data.customDiagnosis)) {
      return res.status(400).json({ message: 'Please specify your diagnosis.' });
    }
  }

  // Validate healthAlert array values if present
  if (data.healthAlert) {
    if (!Array.isArray(data.healthAlert)) {
      return res.status(400).json({ message: 'Health alerts must be an array' });
    }
    const invalidAlert = data.healthAlert.find(
      (a) => !healthAlertOptions.includes(a)
    );
    if (invalidAlert) {
      return res.status(400).json({ message: `Invalid health alert option: ${invalidAlert}` });
    }
  }

  // Validate communicationPreferences array values if present
  if (data.communicationPreferences) {
    if (!Array.isArray(data.communicationPreferences)) {
      return res.status(400).json({ message: 'Communication preferences must be an array' });
    }
    const invalidPref = data.communicationPreferences.find(
      (p) => !communicationPreferenceOptions.includes(p)
    );
    if (invalidPref) {
      return res.status(400).json({ message: `Invalid communication preference: ${invalidPref}` });
    }
  }

  // Validate trustedContact fields
  if (
    !data.trustedContact ||
    !sanitizeString(data.trustedContact.name) ||
    !sanitizeString(data.trustedContact.phone) ||
    !sanitizeString(data.trustedContact.countryCode)
  ) {
    return res.status(400).json({ message: 'Trusted contact name, phone, and country code are required.' });
  }

  // Validate phone number format with country code
  if (!validateInternationalPhone(data.trustedContact.phone, data.trustedContact.countryCode)) {
    return res.status(400).json({ message: 'Trusted contact phone number is invalid for the selected country.' });
  }

  // Sanitize strings in data for safer storage
  data.firstName = sanitizeString(data.firstName);
  data.lastName = sanitizeString(data.lastName);
  data.customDiagnosis = sanitizeString(data.customDiagnosis);
  data.customHealthAlert = sanitizeString(data.customHealthAlert);
  data.allergyList = sanitizeString(data.allergyList);
  data.triggers = sanitizeString(data.triggers);
  data.likes = sanitizeString(data.likes);
  data.dislikes = sanitizeString(data.dislikes);
  data.customPreferences = sanitizeString(data.customPreferences);
  data.trustedContact.name = sanitizeString(data.trustedContact.name);
  data.trustedContact.phone = sanitizeString(data.trustedContact.phone);
  data.trustedContact.countryCode = sanitizeString(data.trustedContact.countryCode);
  data.trustedContact.email = sanitizeString(data.trustedContact.email);
  data.otherInformation = sanitizeString(data.otherInformation);

  next();
}
