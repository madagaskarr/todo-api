const {StatusCodes} = require("../utils/statusCodes");
module.exports = function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid JSON format'});
    }
    next(err);
}