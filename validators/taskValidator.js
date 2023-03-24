const {check} = require("express-validator");
const mongoose = require("mongoose");

exports.validateTask = [
    check("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({min: 1})
        .withMessage("Title must be at least 1 character long"),
    check("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    check("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be a boolean"),
    check('workspace')
        .optional()
        .custom((value) => {
            if (value && !mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid workspace ID');
            }
            return true;
        })
];