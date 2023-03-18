const express = require('express');
const userController = require('../controllers/userController');
const {check} = require("express-validator");

const router = express.Router();

validateRegister = [
    check('username').notEmpty().withMessage('Username is required').isLength({min: 4}).withMessage('Username must be at least 3 characters long'),
    check('password').notEmpty().withMessage('Password is required').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
];

validateLogin = [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
];

validateRefreshToken = [
    check('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);
router.post('/refresh-token', validateRefreshToken, userController.refreshToken);

module.exports = router;
