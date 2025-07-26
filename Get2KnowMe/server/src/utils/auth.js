
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY;

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

export const signToken = ({ email, _id, username }) => {
  return jwt.sign(
    { id: _id, email, username },
    secret,
    { expiresIn: '12h' }
  );
};

export default { authenticateToken, signToken, getUserFromToken };
    
