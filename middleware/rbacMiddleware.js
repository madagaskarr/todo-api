const {errorFactory} = require("../utils/errorHandler");
const {StatusCodes} = require("../utils/statusCodes");
const {hasPermission} = require("../utils/roles");
const workspaceService = require("../services/workspaceService");

function validateTaskAccess(requiredPermission) {
    return async (req, res, next) => {
        const user = req.user.id;

        if (!req.body.workspace) {
            return next();
        }

        const workspaceMember = await workspaceService.getWorkspaceMemberById(req.body.workspace, user);
        if (workspaceMember && hasRequiredPermission(workspaceMember.role, requiredPermission)) {
            return next();
        }

        return next(errorFactory(StatusCodes.FORBIDDEN));
    };
}

function hasRequiredPermission(userRole, requiredPermission) {
    return hasPermission(userRole, requiredPermission);
}


module.exports = validateTaskAccess;