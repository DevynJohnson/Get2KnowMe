import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'follow_request',
      'follow_accepted',
      'passport_update',
      'general'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionTaken: {
    type: Boolean,
    default: false
  },
  actionTakenAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    // Automatically delete old notifications after 30 days
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = new Date();
  await this.save();
};

notificationSchema.methods.markActionTaken = async function() {
  this.actionTaken = true;
  this.actionTakenAt = new Date();
  await this.save();
};

// Static methods
notificationSchema.statics.createFollowRequestNotification = async function(fromUserId, toUserId) {
  const fromUser = await model('User').findById(fromUserId).select('username email');
  if (!fromUser) throw new Error('Sender not found');

  const displayName = fromUser.username;
  const email = fromUser.email;

  return await this.create({
    recipient: toUserId,
    sender: fromUserId,
    type: 'follow_request',
    title: 'New Follow Request',
    message: `${displayName} (${email}) wants to follow your Communication Passport`,
    data: {
      followRequestId: fromUserId,
      username: displayName,
      email: email
    }
  });
};

notificationSchema.statics.createFollowAcceptedNotification = async function(fromUserId, toUserId) {
  const fromUser = await model('User').findById(fromUserId).select('username email');
  if (!fromUser) throw new Error('Sender not found');

  const displayName = fromUser.username;
  const email = fromUser.email;

  return await this.create({
    recipient: toUserId,
    sender: fromUserId,
    type: 'follow_accepted',
    title: 'Follow Request Accepted',
    message: `${displayName} (${email}) accepted your follow request`,
    data: {
      username: displayName,
      email: email
    }
  });
};

notificationSchema.statics.createPassportUpdateNotification = async function(updatedUserId, changes) {
  const updatedUser = await model('User').findById(updatedUserId)
    .select('username email communicationPassport.profilePasscode followers')
    .populate('followers.user', 'username');

  if (!updatedUser || !updatedUser.followers.length) return;

  const displayName = updatedUser.username;
  const email = updatedUser.email;
  // Ensure passcode is decrypted (mongoose-field-encryption will handle this if configured)
  const passcode = updatedUser.communicationPassport?.profilePasscode;
  console.log('Decrypted passcode for notification:', passcode);
  const followerIds = updatedUser.followers.map(f => f.user._id);

  // Always include passcode, username, email in data, even if passportChanges is empty
  const notifications = followerIds.map(followerId => ({
    recipient: followerId,
    sender: updatedUserId,
    type: 'passport_update',
    title: 'Communication Passport Updated',
    message: `${displayName} (${email}) has updated their Communication Passport`,
    data: {
      passportChanges: Array.isArray(changes) ? changes : [],
      passcode: passcode || '',
      username: displayName,
      email: email
    }
  }));

  return await this.insertMany(notifications);
};

// Virtual for formatted creation time
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
});

const Notification = model('Notification', notificationSchema);

export default Notification;