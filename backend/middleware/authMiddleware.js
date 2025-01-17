const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/blacklist');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const blacklisted = await isBlacklisted(token);
        if (blacklisted) {
            return res.status(401).send({ error: 'Access denied. Token is blacklisted.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;