const Story = require('../models/storyModel');
const {errorFactory} = require('../utils/errorHandler');
const {sendResponse} = require('../utils/responseHandler');
const {StatusCodes} = require("../utils/statusCodes");
const {validationResult} = require("express-validator");

exports.createStory = async (req, res, next) => {
    validateRequest(req, next)

    try {
        const story = new Story({...allowedUpdates(req.body), user: req.user.id});
        const savedStory = await task.save();
        sendResponse(res, StatusCodes.CREATED, formatTaskResponse(savedStory));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getStory = async (req, res, next) => {
    try {
        const tasks = await Story.find({user: req.user});
        sendResponse(res, StatusCodes.OK, tasks.map(formatTaskResponse));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getStory = async (req, res, next) => {
    try {
        const task = await Story.findOne({_id: req.params.id, user: req.user.id});
        if (!task) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(task));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.updateStory = async (req, res, next) => {
    validateRequest(req, next)

    try {
        const task = await Story.findOneAndUpdate(
            {_id: req.params.id, user: req.user.id},
            {$set: allowedUpdates(req.body)},
            {new: true}
        );
        if (!story) {
            return next(errorFactory(StatusCodes.NOT_FOUND, 'Story is not found'));
        }
        await story.save();
        sendResponse(res, StatusCodes.OK, formatTaskResponse(story));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
};

exports.deleteStory = async (req, res, next) => {
    try {
        const task = await Story.findOneAndDelete({_id: req.params.id, user: req.user.id});
        if (!task) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(story))
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

function validateRequest(req, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }
}

function formatTaskResponse(story) {
    return {
        id: story._id,
        title: story.title,
        user: story.user,
    };
}

const allowedUpdates = (body) => {
    const allowedFields = ['title'];
    const updates = {};

    for (const field of allowedFields) {
        if (body.hasOwnProperty(field)) {
            updates[field] = body[field];
        }
    }

    return updates;
