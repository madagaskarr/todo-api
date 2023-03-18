const {DbConnectionError} = require("../error/errorTypes");

module.exports = function (err, req, res, next) {

    let statusCode = err.statusCode;
    let message = err.message;
    let developerDebugMessage = err.developerDebugMessage;
    let errorType = err.errorType;

    if (process.env.NODE_ENV === 'production') {
        res.status(statusCode).json({ message: message });
    } else {
        res.status(statusCode).json({ message, developerDebugMessage, errorType});
    }
};