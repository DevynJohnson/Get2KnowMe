import { authenticateToken } from '../utils/auth.js';

export default function authenticateTokenMiddleware(req, res, next) {
  try {
    const { user } = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
