
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

const secret = process.env.JWT_SECRET_KEY;
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET_KEY;

// Generate short-lived access token (15 minutes)
export const signAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    secret,
    { expiresIn: '15m' }
  );
};

// Generate long-lived refresh token (7 days)
export const signRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    refreshSecret,
    { expiresIn: '7d' }
  );
};

// Store refresh token in database
export const storeRefreshToken = async (token, userId) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshToken.create({
    token,
    userId,
    expiresAt
  });
};

// Verify refresh token
export const verifyRefreshToken = async (token) => {
  try {
    // First check if token exists and is not revoked
    const storedToken = await RefreshToken.findOne({ token, revoked: false });
    if (!storedToken) {
      return { valid: false, error: 'Token not found or revoked' };
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, refreshSecret);
    
    return { valid: true, userId: decoded.id, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Revoke refresh token (for logout)
export const revokeRefreshToken = async (token) => {
  await RefreshToken.updateOne(
    { token },
    { revoked: true, revokedAt: new Date() }
  );
};

// Revoke all refresh tokens for a user (for password change, etc.)
export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, revoked: false },
    { revoked: true, revokedAt: new Date() }
  );
};

// Legacy function for backward compatibility (12-hour tokens)
export const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    secret,
    { expiresIn: '12h' }
  );
};

// Secure Express middleware for authenticating JWTs
export const authenticateToken = (req, res, next) => {
  let token = req.body?.token || req.query?.token || req.headers?.authorization;
  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret || '');
    // Always map id to _id for consistency
    req.user = {
      _id: decoded.id || decoded._id,
      email: decoded.email,
      username: decoded.username
    };
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Utility function for extracting user from a token (for non-route use, e.g. sockets)
export const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret || '');
    return {
      _id: decoded.id || decoded._id,
      email: decoded.email,
      username: decoded.username
    };
  } catch {
    return null;
  }
};

export default { 
  authenticateToken, 
  signToken, 
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  getUserFromToken 
};
    
