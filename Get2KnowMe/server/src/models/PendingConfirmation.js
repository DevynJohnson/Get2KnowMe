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
  password: {
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


// Add pre-save hook for password hashing (same as User.js)
import bcrypt from "bcrypt";
pendingConfirmationSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const PendingConfirmation = model("PendingConfirmation", pendingConfirmationSchema);
export default PendingConfirmation;
