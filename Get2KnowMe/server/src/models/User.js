import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// Communication Passport subdocument schema
const communicationPassportSchema = new Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  preferredName: {
    type: String,
    trim: true,
  },
  diagnosis: {
    type: String,
    enum: [
      'ASD (Autism Spectrum Disorder)',
      'ADHD',
      'OCD',
      'Dyslexia',
      'Tourette\'s Syndrome',
      'C-PTSD (Complex PTSD)',
      'Anxiety',
      'No Diagnosis',
      'C-PTSD (Complex PTSD)',
      'Anxiety',
      'No Diagnosis',
      'Other'
    ]
  },
  diagnoses: [{
    type: String,
    enum: [
      'ASD (Autism Spectrum Disorder)',
      'ADHD',
      'OCD',
      'Dyslexia',
      'Tourette\'s Syndrome',
      'C-PTSD (Complex PTSD)',
      'Anxiety',
      'No Diagnosis',
      'C-PTSD (Complex PTSD)',
      'Anxiety',
      'No Diagnosis',
      'Other'
    ]
  }],
  customDiagnosis: {
    type: String,
    trim: true,
    // Required only if diagnosis is 'Other' (backward compatibility) or diagnoses includes 'Other'
    required: function() {
      return this.diagnosis === 'Other' || (this.diagnoses && this.diagnoses.includes('Other'));
    }
  },
  communicationPreferences: [{
    type: String,
    enum: [
      'I will understand things better if you speak slowly',
      'I may need extra time to process when you are speaking to me, it may take me a moment to respond',
      'Please avoid complicated questions or confusing language',
      'I do not enjoy physical contact, please do not touch me',
      'Please use gestures and non-verbal cues if possible, they help me understand better',
      'Reading can take me some time, please be patient and allow me time to process the information',
      'I will understand things better if you speak slowly',
      'I may need extra time to process when you are speaking to me, it may take me a moment to respond',
      'Please avoid complicated questions or confusing language',
      'I do not enjoy physical contact, please do not touch me',
      'Please use gestures and non-verbal cues if possible, they help me understand better',
      'Reading can take me some time, please be patient and allow me time to process the information',
      'Other'
    ]
  }],
  customPreferences: {
    type: String,
    trim: true
  },
  triggers: {
    type: String,
    trim: true
  },
  likes: {
    type: String,
    trim: true
  },
  dislikes: {
    type: String,
    trim: true
  },
  trustedContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    countryCode: {
      type: String,
      trim: true,
      default: 'US'
    },
    email: {
      type: String,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid e-mail address for trusted contact']
    }
  },
  profilePasscode: {
    type: String,
    trim: true,
    minlength: 6,
    maxlength: 20
  },
  otherInformation: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
    trim: true // Ensures spaces are trimmed from the email
  },
  password: {
    type: String,
    validate: {
      validator: function (password) {
        // Check if password is at least 8 characters long
        if (password.length < 8) return false;
        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) return false;
        // Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) return false;
        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
        return true;
      },
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*()_+-=[]{};'\"\\|,.<>/?)",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  consent: {
    agreedToTerms: { type: Boolean, required: true },
    ageConfirmed: { type: Boolean, required: true },
    consentTimestamp: { type: Date, default: Date.now },
    ipAddress: { type: String }, // optional but helpful
    userAgent: { type: String }, // optional
  },

  communicationPassport: communicationPassportSchema,
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now // Automatically set the update date
  }
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      // Use bcrypt to hash the password
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Normalize email and username before saving
userSchema.pre('save', function (next) {
  if (this.isModified('email') && this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  if (this.isModified('username') && this.username) {
    this.username = this.username.trim();
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare the provided password with the stored hash
};

// Automatically update 'updatedAt' field whenever the document is modified
userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() }); // Set the current date for updatedAt
  next();
});

// Ensures unique profile passcode while not requiring it during user creation
userSchema.index(
  { 'communicationPassport.profilePasscode': 1 },
  { unique: true, sparse: true }
);


const User = model("User", userSchema);

export default User;
