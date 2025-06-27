import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY

export const authenticateToken = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }
    if (!token) {
        return { user: null };  
    }

    try {
        const decoded = jwt.verify(token, secret || '');
        return { user: {_id: decoded._id, email: decoded.email } };
    }
    catch (error) {
        console.log(error.message);
        return { user: null };
    }
};

export const signToken = ({ email, _id }) => {
    const payload = { email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: '6h' });
}

export default { authenticateToken, signToken };
    
