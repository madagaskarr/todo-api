const {validationResult} = require("express-validator");
const {errorFactory} = require("../utils/errorHandler");
const {StatusCodes} = require("../utils/statusCodes");
const {sendResponse} = require("../utils/responseHandler");
const {Workspace, RoleEnum} = require('../models/workspaceModel');

exports.createWorkspace = async (req, res, next) => {
    validateRequest(req, next);

    try {
        const workspace = new Workspace({name: req.body.name, owner: req.user.id});
        workspace.members.push({user: req.user.id, role: RoleEnum.ADMIN});
        const savedWorkspace = await workspace.save();
        sendResponse(res, StatusCodes.CREATED, formatTaskResponse(savedWorkspace));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getWorkspaces = async (req, res, next) => {

    const {filter} = req.query;
    let filterObj;
    switch (filter) {
        case 'owner':
            filterObj = {owner: req.user.id};
            break;
        case 'member':
            filterObj = {"members.user": req.user.id};
            break;
        case 'invited':
            filterObj = {owner: {$ne: req.user.id}, "members.user": req.user.id};
            break;
        default:
            filterObj = {"members.user": req.user.id};
            break;
    }

    try {
        const workspaces = await Workspace.find(filterObj);
        sendResponse(res, StatusCodes.OK, workspaces.map(formatTaskResponse));
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.getWorkspace = async (req, res, next) => {

    try {
        const workspace = await Workspace.findOne({
            _id: req.params.id,
            $or: [{owner: req.user.id},
                {'members.user': req.user.id}],
        });
        if (!workspace) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(workspace));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.updateWorkspace = async (req, res, next) => {
    validateRequest(req, next);

    try {
        const workspace = await Workspace.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id, 'members.role': RoleEnum.EDITOR }
            ],
        });
        if (!workspace) {
            return next(errorFactory(StatusCodes.NOT_FOUND, 'Task not found'));
        } else {
            workspace.name = req.body.name;
            const savedWorkspace = await workspace.save();
            sendResponse(res, StatusCodes.OK, formatTaskResponse(savedWorkspace));
        }
    } catch (err) {
        next(errorFactory(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
};

exports.deleteWorkspace = async (req, res, next) => {

    try {
        const workspace = await Workspace.findOneAndDelete({_id: req.params.id, owner: req.user.id});
        if (!workspace) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        } else {
            sendResponse(res, StatusCodes.OK, formatTaskResponse(workspace))
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

function formatTaskResponse(workspace) {
    return {
        id: workspace._id,
        name: workspace.name,
        owner: workspace.owner,
    };
}