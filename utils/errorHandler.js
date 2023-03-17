const { StatusCodes } = require('./statusCodes');

const errorTypes = {
    [StatusCodes.BAD_REQUEST]: {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bad Request',
    },
    [StatusCodes.UNAUTHORIZED]: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
    },
    [StatusCodes.FORBIDDEN]: {
        statusCode: StatusCodes.FORBIDDEN,
        message: 'Forbidden',
    },
    [StatusCodes.NOT_FOUND]: {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Not Found',
    },
    [StatusCodes.INTERNAL_SERVER_ERROR]: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
    }
};

const errorFactory = (statusCode, message = null) => {
    const error = new Error(message || errorTypes[statusCode].message);
    error.statusCode = errorTypes[statusCode].statusCode;
    return error;
};

module.exports = { errorFactory };
