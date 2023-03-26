const {errorFactory} = require("../utils/errorHandler");
const {StatusCodes} = require("../utils/statusCodes");
const {Workspace} = require("../models/workspaceModel");
const {hasPermission} = require("../utils/roles");

function validate(requiredPermission) {
    return async (req, res, next) => {
        const user = req.user.id;
        const workspace = await Workspace.findById(req.body.workspace);

        if (workspace) {
            const workspaceMember = workspace.members.find(member => member.user.toString() === user);

            if (workspaceMember && hasRequiredPermission(workspaceMember.role, requiredPermission)) {
                return next();
            }
            return next(errorFactory(StatusCodes.FORBIDDEN));
        }

        return next();
    };
}

function hasRequiredPermission(userRole, requiredPermission) {
    return hasPermission(userRole, requiredPermission);
}


module.exports = validate;