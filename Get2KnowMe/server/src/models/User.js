import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// Communication Passport subdocument schema
const communicationPassportSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  preferredName: {
    type: String,
    trim: true
  },
  diagnosis: {
    type: String,
    required: true,
    enum: [
      'ASD (Autism Spectrum Disorder)',
      'ADHD',
      'AuDHD (Autism + ADHD)',
      'OCD',
      'Dyslexia',
      'Tourette\'s Syndrome',
      'Other'
    ]
  },
  diagnoses: [{
    type: String,
    enum: [
      'ASD (Autism Spectrum Disorder)',
      'ADHD',
      'AuDHD (Autism + ADHD)',
      'OCD',
      'Dyslexia',
      'Tourette\'s Syndrome',
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
      'Speak slowly',
      'Allow extra time to process',
      'Avoid complicated questions or confusing language',
      'Avoid specific words/phrases/topics',
      'Other'
    ]
  }],
  avoidWords: {
    type: String,
    trim: true
  },
  customPreferences: {
    type: String,
    trim: true
  },
  trustedContact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    countryCode: {
      type: String,
      required: true,
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
    required: true,
    unique: true,
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
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
    trim: true, // Ensures spaces are trimmed from the email
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(password) {
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
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*()_+-=[]{};\'"\\|,.<>/?)'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  communicationPassport: communicationPassportSchema,
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update date
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
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

// Method to compare passwords during login
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Compare the provided password with the stored hash
};

// Automatically update 'updatedAt' field whenever the document is modified
userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() }); // Set the current date for updatedAt
  next();
});

const User = model('User', userSchema);

export default User;
