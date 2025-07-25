import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY

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
        req.user = { _id: decoded.id, email: decoded.email, username: decoded.username };
        next();
    }
    catch (error) {
        console.log('Token verification error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const signToken = ({ email, _id, username }) => {
    return jwt.sign(
        { id: _id, email, username },
        secret,
        { expiresIn: '12h' }
    );
}

export default { authenticateToken, signToken };
    
