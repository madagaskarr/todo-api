const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

function generateAccessToken(user) {
    const payload = { user: { id: user.id } };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '2d' });
}

function generateRefreshToken(user) {
    const payload = { user: { id: user.id } };
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '10d' });
}

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({ accessToken: newAccessToken, refreshToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
