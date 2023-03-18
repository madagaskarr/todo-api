const {StatusCodes} = require("../utils/statusCodes");

class BaseError extends Error {
    constructor(message, statusCode, errorType, developerDebugMessage) {
        super(message);

        this.name = this.constructor.name;
        this.developerDebugMessage = developerDebugMessage;
        this.statusCode = statusCode;
        this.errorType = errorType;
        Error.captureStackTrace(this, this.constructor);

        if (process.env.NODE_ENV === 'production') {
            this.developerDebugMessage = null;
        }
    }
}

class DbConnectionError extends BaseError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED, "DbConnectionError", "The connection of the db just failed!");
    }
}

class InternalServerError extends BaseError {
    constructor(message) {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR, "InternalServerError", "Some developer related message");
    }
}

class AuthenticationError extends BaseError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED, "AuthenticationError", "Some developer related message");
    }
}

module.exports = {
    BaseError,
    DbConnectionError,
    AuthenticationError,
    InternalServerError,
}