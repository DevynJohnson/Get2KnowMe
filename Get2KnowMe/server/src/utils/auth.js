import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY

export const authenticateToken = (req) => {
    // Handle both { req } and direct req parameter
    const requestObj = req.req || req;
    
    if (!requestObj) {
        console.log('No request object provided');
        return { user: null };
    }
    
    let token = requestObj.body?.token || requestObj.query?.token || requestObj.headers?.authorization;
    if (requestObj.headers?.authorization) {
        token = token.split(' ').pop().trim();
    }
    if (!token) {
        return { user: null };  
    }

    try {
        const decoded = jwt.verify(token, secret || '');
        // Handle token structure from user-routes.js (id, email, username)
        return { user: {_id: decoded.id, email: decoded.email, username: decoded.username } };
    }
    catch (error) {
        console.log('Token verification error:', error.message);
        return { user: null };
    }
};

export const signToken = ({ email, _id, username }) => {
    return jwt.sign(
        { id: _id, email, username },
        secret,
        { expiresIn: '7d' }
    );
}

export default { authenticateToken, signToken };
    
