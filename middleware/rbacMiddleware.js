const {errorFactory} = require("../utils/errorHandler");
const {StatusCodes} = require("../utils/statusCodes");
const {hasPermission} = require("../utils/roles");
const workspaceService = require("../services/workspaceService");
const taskService = require("../services/taskService");

function validateTaskAccess(requiredPermission) {
    return async (req, res, next) => {
        const user = req.user.id;
        const taskId = req.params.id;

        const task = await taskService.getTaskById(taskId);
        const taskWorkspaceId = task ? task.workspace : null;
        const workspaceId = taskId ? taskWorkspaceId : req.body.workspace;

        // If the task is not found, return a 404 Not Found response
        if (taskId && !task) {
            return next(errorFactory(StatusCodes.NOT_FOUND));
        }

        if (workspaceId) {
            const workspaceMember = await workspaceService.getWorkspaceMemberById(workspaceId, user);
            if (workspaceMember && hasRequiredPermission(workspaceMember.role, requiredPermission)) {
                return next();
            }
        } else {
            //User owner of the task
            if (task && task.user.toString() === user) {
                return next();
            }
        }

        return next(errorFactory(StatusCodes.FORBIDDEN));
    };
}

function hasRequiredPermission(userRole, requiredPermission) {
    return hasPermission(userRole, requiredPermission);
}


module.exports = validateTaskAccess;