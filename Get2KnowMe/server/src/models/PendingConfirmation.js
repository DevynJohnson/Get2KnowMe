import { Schema, model } from "mongoose";

const pendingConfirmationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  consent: {
    agreedToTerms: { type: Boolean, required: true },
    ageConfirmed: { type: Boolean, required: true },
    consentTimestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  confirmToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
});

const PendingConfirmation = model("PendingConfirmation", pendingConfirmationSchema);
export default PendingConfirmation;
