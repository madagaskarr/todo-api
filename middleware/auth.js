const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('config');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.get('JWT_SECRET'));
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;
