const {sendResponse} = require('../utils/responseHandler');

module.exports = function (err, req, res, next) {
    const { statusCode, message, data } = err;
    sendResponse(res, statusCode, { message, ...(data && { data }) });
};