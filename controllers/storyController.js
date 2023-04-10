const Story = require('../models/storyModel');
const {errorFactory} = require('../utils/errorHandler');
const {sendResponse} = require('../utils/responseHandler');
const {StatusCodes} = require("../utils/statusCodes");
const {validationResult} = require("express-validator");
const {Workspace, RoleEnum} = require("../models/workspaceModel");

exports.createStory = async (req, res, next) => {
    validateRequest(req, next);

    try {
        const story = new Story({title: req.body.title, user: req.user.id});
        const savedStory = await story.save();
        sendResponse(res, StatusCodes.CREATED, formatStoryResponse(savedStory));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getStoryById = async (req, res, next) => {
    try {
        const story = await Story.findOne({_id: req.params.id, user: req.user.id});
        if (!story) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatStoryResponse(story));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getStories = async (req, res, next) => {
    try {
        const stories = await Story.find({user: req.user.id});
        sendResponse(res, StatusCodes.OK, stories.map(formatStoryResponse));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.updateStory = async (req, res, next) => {
    validateRequest(req, next);
    try {
        const story = await Story.findOneAndUpdate({_id: req.params.id}, {$set: {title: req.body.title}},);
        if (!story) {
            return next(errorFactory(StatusCodes.NOT_FOUND, 'Story is not found'));
        } else {
            story.title = req.body.title;
            const savedStory = await story.save();
            sendResponse(res, StatusCodes.OK, formatStoryResponse(savedStory));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
};

exports.deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findOneAndDelete({_id: req.params.id, user: req.user.id});
        if (!story) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatStoryResponse(story));
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

function formatStoryResponse(story) {
    return {
        id: story._id,
        title: story.title,
        user: story.user
    }
}