const {errorFactory} = require("../utils/errorHandler");
const {StatusCodes} = require("../utils/statusCodes");
const {defineAbilitiesFor, permissions} = require("../utils/roles");
const workspaceService = require("../services/workspaceService");
const taskService = require("../services/taskService");

const Type = {
    CREATE: "create_task",
    GET_TASK: "get_task",
    EDIT: "edit_task",
    DELETE: "delete_task",
};

function validateTaskAccess(type) {
    return async (req, res, next) => {

        const userId = req.user.id;
        let hasAccess;

        switch (type) {
            case Type.CREATE:
                hasAccess = await createTask(userId, req.body.workspace);
                break;

            // case Type.GET_TASK:
            //     getTask(userId, taskIdFromParam,);
            //     break;
            //
            // case Type.EDIT:
            //     editTask(userId,);
            //     break;
            //
            // case Type.DELETE:
            //     deleteTask(userId,);
            //     break;

            default:
                const taskId = req.params.id
                const workspace = await taskService.getWorkspaceByTaskId(taskId);
                const id = workspace._id;
                const workspaceMember = await workspaceService.getWorkspaceMemberById(id, userId);
                const userRole = workspaceMember?.role;
                const ability = defineAbilitiesFor(userRole);
                hasAccess = ability.can(permissions.TASK_CREATE, "Task");
                break;
        }

        return hasAccess ? next() : next(errorFactory(StatusCodes.FORBIDDEN));
    }
}

async function createTask(userID, workspaceId) {
    const workspaceMember = await workspaceService.getWorkspaceMemberById(workspaceId, userID);
    const userRole = workspaceMember?.role;
    const ability = defineAbilitiesFor(userRole);
    return ability.can(permissions.TASK_CREATE, "Task");
}

function getTask(userID, taskID, workspaceId) {

}

function editTask(userID, taskID, workspaceId) {

}

function deleteTask(userID, taskID, workspaceId) {

}

module.exports = {validateTaskAccess, Type};