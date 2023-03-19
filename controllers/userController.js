const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const {errorFactory} = require('../utils/errorHandler');
const {sendResponse} = require('../utils/responseHandler');
const {StatusCodes} = require('../utils/statusCodes');
const {validationResult} = require("express-validator");


function generateAccessToken(user) {
    const payload = {user: {id: user.id}};
    return jwt.sign(payload, config.JWT_SECRET, {expiresIn: '2d'});
}

function generateRefreshToken(user) {
    const payload = {user: {id: user.id}};
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '10d'});
}

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }

    const {username, password} = req.body;

    try {
        let user = await User.findOne({username});
        if (user) {
            return next(errorFactory(StatusCodes.BAD_REQUEST, 'User already exists'));
        }

        user = new User({username, password});
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        let resData = formatUserResponse(user, accessToken, refreshToken);
        sendResponse(res, StatusCodes.CREATED, resData);
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }

    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});

        if (!user) {
            return next(errorFactory(StatusCodes.BAD_REQUEST, 'Invalid username or password'));
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(errorFactory(StatusCodes.BAD_REQUEST, 'Invalid username or password'));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        let resData = formatUserResponse(user, accessToken, refreshToken);
        sendResponse(res, StatusCodes.OK, resData);
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.refreshToken = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }

    const {refreshToken} = req.body;

    if (!refreshToken) {
        return next(errorFactory(StatusCodes.UNAUTHORIZED, 'No refresh token, authorization denied'));
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(400).json({message: 'Invalid refresh token'});
        }

        const newAccessToken = generateAccessToken(user);

        let resData = formatUserResponse(user, newAccessToken, refreshToken);
        sendResponse(res, StatusCodes.OK, resData);
    } catch (err) {
        next(errorFactory(StatusCodes.UNAUTHORIZED, 'Invalid refresh token'));
    }
};


function formatUserResponse(user, accessToken, refreshToken) {
    return {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}
