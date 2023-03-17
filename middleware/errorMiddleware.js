const {sendResponse} = require('../utils/responseHandler');
const { StatusCodes } = require('../utils/statusCodes');

module.exports = function (err, req, res, next) {
    let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message;

    sendResponse(res, statusCode, { message: message });
};