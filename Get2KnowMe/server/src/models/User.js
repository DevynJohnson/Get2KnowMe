import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { fieldEncryption } from "mongoose-field-encryption";

// Communication Passport subdocument schema
const communicationPassportSchema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  preferredName: { type: String, trim: true },
  preferredPronouns: {
    type: String,
    enum: [
      'He/Him',
      'She/Her',
      'They/Them',
      'Other'
    ]
  },
  customPronouns: { type: String, trim: true,
  required: function () {
    return this.preferredPronouns === 'Other' || this.preferredPronouns === 'Custom';
  }},
  diagnoses: [{
    type: String,
    enum: [
      'Autism Spectrum Disorder (ASD)',
      'Attention Deficit Hyperactivity Disorder (ADHD)',
      'Obsessive-Compulsive Disorder (OCD)',
      'Dyslexia',
      'Dyscalculia',
      'Tourette\'s Syndrome',
      'C-PTSD (Complex PTSD)',
      'Anxiety',
      'No Diagnosis',
      'Other'
    ]
  }],
  customDiagnosis: {
    type: String,
    trim: true,
    required: function() {
      return this.diagnosis === 'Other' || (this.diagnoses && this.diagnoses.includes('Other'));
    }
  },
  healthAlert: [{
    type: String,
    trim: true,
    enum: [
      'None',
      'Type 1 Diabetes',
      'Type 2 Diabetes',
      'Epilepsy',
      'Allergies',
      'Other'
    ]
  }],
  customHealthAlert: { type: String, trim: true },
  allergyList: { type: String, trim: true },
  communicationPreferences: [{
    type: String,
    enum: [
      'I will understand things better if you speak slowly',
      'I may need extra time to process when you are speaking to me, it may take me a moment to respond',
      'Please avoid complicated questions or confusing language',
      'I do not enjoy physical contact, please do not touch me',
      'Please use gestures and non-verbal cues if possible, they help me understand better',
      'Reading can take me some time, please be patient and allow me time to process the information',
      'Other'
    ]
  }],
  customPreferences: { type: String, trim: true },
  triggers: { type: String, trim: true },
  likes: { type: String, trim: true },
  dislikes: { type: String, trim: true },
  trustedContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    countryCode: { type: String, trim: true, default: 'GB' },
    email: {
      type: String,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid e-mail address for trusted contact']
    }
  },
  profilePasscode: { type: String, trim: true, minlength: 6, maxlength: 20 },
  otherInformation: { type: String, trim: true, maxlength: 1000 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

communicationPassportSchema.plugin(fieldEncryption, {
  fields: [
    'firstName',
    'lastName',
    'preferredName',
    'preferredPronouns',
    'customPronouns',
    'diagnosis',
    'diagnoses',
    'customDiagnosis',
    'healthAlert',
    'customHealthAlert',
    'allergyList',
    'communicationPreferences',
    'customPreferences',
    'triggers',
    'likes',
    'dislikes',
    'trustedContact',
    'profilePasscode',
    'otherInformation'
  ],
  secret: process.env.FIELD_ENCRYPTION_SECRET,
  saltGenerator: secret => secret.slice(0, 16)
});

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
    trim: true
  },
  password: {
    type: String,
    validate: {
      validator: function (password) {
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
        return true;
      },
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*()_+-=[]{};'\"\\|,.<>/?)",
    },
  },
  username: { type: String, required: true, unique: true },
  consent: {
    agreedToTerms: { type: Boolean, required: true },
    ageConfirmed: { type: Boolean, required: true },
    consentTimestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  communicationPassport: communicationPassportSchema,
  // Privacy settings for social features (moved to root)
  privacySettings: {
    allowFollowRequests: { type: Boolean, default: true },
    showInSearch: { type: Boolean, default: true }
  },
  // Social network features
  followers: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    followedAt: { type: Date, default: Date.now }
  }],
  following: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    followedAt: { type: Date, default: Date.now }
  }],
  pendingFollowRequests: [{
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now }
  }],
  sentFollowRequests: [{
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now }
  }],
  // NEW: Hidden notifications feature
  hiddenNotifications: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      // Only hash if not already a bcrypt hash
      if (!/^\$2[aby]\$\d{2}\$/.test(this.password)) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.pre('save', function (next) {
  if (this.isModified('email') && this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  if (this.isModified('username') && this.username) {
    this.username = this.username.trim();
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Social network methods
userSchema.methods.sendFollowRequest = async function (targetUserId) {
  if (this._id.equals(targetUserId)) {
    throw new Error('Cannot follow yourself');
  }

  const targetUser = await this.constructor.findById(targetUserId);
  if (!targetUser) {
    throw new Error('User not found');
  }

  // Check if already following
  const alreadyFollowing = this.following.some(f => f.user.equals(targetUserId));
  if (alreadyFollowing) {
    throw new Error('Already following this user');
  }

  // Check if request already sent
  const requestAlreadySent = this.sentFollowRequests.some(r => r.to.equals(targetUserId));
  if (requestAlreadySent) {
    throw new Error('Follow request already sent');
  }

  // Add to pending requests
  this.sentFollowRequests.push({ to: targetUserId });
  targetUser.pendingFollowRequests.push({ from: this._id });

  await this.save();
  await targetUser.save();

  return true;
};

userSchema.methods.acceptFollowRequest = async function (fromUserId) {
  const requestIndex = this.pendingFollowRequests.findIndex(r => r.from.equals(fromUserId));
  if (requestIndex === -1) {
    throw new Error('Follow request not found');
  }

  const requester = await this.constructor.findById(fromUserId);
  if (!requester) {
    throw new Error('Requester not found');
  }

  // Remove from pending requests
  this.pendingFollowRequests.splice(requestIndex, 1);
  const sentRequestIndex = requester.sentFollowRequests.findIndex(r => r.to.equals(this._id));
  if (sentRequestIndex !== -1) {
    requester.sentFollowRequests.splice(sentRequestIndex, 1);
  }

  // Add to followers/following
  this.followers.push({ user: fromUserId });
  requester.following.push({ user: this._id });

  await this.save();
  await requester.save();

  return true;
};

userSchema.methods.rejectFollowRequest = async function (fromUserId) {
  const requestIndex = this.pendingFollowRequests.findIndex(r => r.from.equals(fromUserId));
  if (requestIndex === -1) {
    throw new Error('Follow request not found');
  }

  const requester = await this.constructor.findById(fromUserId);
  if (requester) {
    const sentRequestIndex = requester.sentFollowRequests.findIndex(r => r.to.equals(this._id));
    if (sentRequestIndex !== -1) {
      requester.sentFollowRequests.splice(sentRequestIndex, 1);
      await requester.save();
    }
  }

  this.pendingFollowRequests.splice(requestIndex, 1);
  await this.save();

  return true;
};

userSchema.methods.unfollowUser = async function (targetUserId) {
  const followingIndex = this.following.findIndex(f => f.user.equals(targetUserId));
  if (followingIndex === -1) {
    throw new Error('Not following this user');
  }

  const targetUser = await this.constructor.findById(targetUserId);
  if (targetUser) {
    const followerIndex = targetUser.followers.findIndex(f => f.user.equals(this._id));
    if (followerIndex !== -1) {
      targetUser.followers.splice(followerIndex, 1);
      await targetUser.save();
    }
  }

  this.following.splice(followingIndex, 1);
  await this.save();

  return true;
};

// NEW: Hidden notifications methods
userSchema.methods.hideNotificationsFrom = async function (userId) {
  if (!this.hiddenNotifications.includes(userId)) {
    this.hiddenNotifications.push(userId);
    await this.save();
  }
  return true;
};

userSchema.methods.unhideNotificationsFrom = async function (userId) {
  const index = this.hiddenNotifications.indexOf(userId);
  if (index !== -1) {
    this.hiddenNotifications.splice(index, 1);
    await this.save();
  }
  return true;
};

userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

userSchema.index(
  { 'communicationPassport.profilePasscode': 1 },
  { unique: true, sparse: true }
);

// Indexes for social features
userSchema.index({ 'followers.user': 1 });
userSchema.index({ 'following.user': 1 });
userSchema.index({ 'pendingFollowRequests.from': 1 });
userSchema.index({ hiddenNotifications: 1 }); // NEW: Index for hidden notifications
userSchema.index({ username: 'text', 'communicationPassport.profilePasscode': 'text' });

const User = model("User", userSchema);

export default User;