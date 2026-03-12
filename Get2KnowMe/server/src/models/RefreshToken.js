// server/src/models/RefreshToken.js
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Track if token has been revoked (for logout functionality)
  revoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  }
});

// Index for faster queries
refreshTokenSchema.index({ userId: 1 });

// Automatically delete expired tokens (also serves as index for expiresAt)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
