const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authenticationCheck = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Authorization token required');
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = payload;
        next();
    });
};

module.exports = authenticationCheck;
