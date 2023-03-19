const Task = require('../models/taskModel');
const {errorFactory} = require('../utils/errorHandler');
const {sendResponse} = require('../utils/responseHandler');
const {StatusCodes} = require("../utils/statusCodes");
const {validationResult} = require("express-validator");

exports.createTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }

    try {
        const task = new Task({...req.body, user: req.user.id});
        const savedTask = await task.save();
        sendResponse(res, StatusCodes.CREATED, formatTaskResponse(savedTask));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({user: req.user});
        sendResponse(res, StatusCodes.OK, tasks.map(formatTaskResponse));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({_id: req.params.id, user: req.user.id});
        if (!task) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(task));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorFactory(StatusCodes.BAD_REQUEST, 'Validation error', errors.array()));
    }

    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id, user: req.user.id},
            req.body,
            {new: true}
        );
        if (!task) {
            return next(errorFactory(StatusCodes.NOT_FOUND, 'Task not found'));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(task));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, user: req.user.id});
        if (!task) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(task))
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

function formatTaskResponse(task) {
    return {
        id: task._id,
        title: task.title,
        description: task.description,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completed: task.completed,
        user: task.user,
    };
}