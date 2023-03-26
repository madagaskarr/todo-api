const {Role} = require("../models/workspaceModel")

const Permissions = {
    TASK_CREATE: 'create_task',
    TASK_EDIT: 'edit_task',
    TASK_DELETE: 'delete_task',
    TASK_VIEW: 'view_task',
    EDIT_WORKSPACE: 'edit_workspace',
    DELETE_WORKSPACE: 'delete_workspace',
    VIEW_WORKSPACE: 'view_workspace',
};

const rolePermissions = {
    [Role.ADMIN]: [
        Permissions.TASK_CREATE,
        Permissions.TASK_EDIT,
        Permissions.TASK_DELETE,
        Permissions.TASK_VIEW,
        Permissions.EDIT_WORKSPACE,
        Permissions.DELETE_WORKSPACE,
        Permissions.VIEW_WORKSPACE,
    ],
    [Role.MEMBER]: [
        Permissions.TASK_CREATE,
        Permissions.TASK_EDIT,
        Permissions.TASK_DELETE,
        Permissions.TASK_VIEW,
        Permissions.EDIT_WORKSPACE,
        Permissions.VIEW_WORKSPACE,
    ],
    [Role.GUEST]: [
        Permissions.TASK_VIEW,
        Permissions.VIEW_WORKSPACE],
};

const hasPermission = (userRole, requiredPermission) => {
    return rolePermissions[userRole].includes(requiredPermission);
};

module.exports = {Permissions, hasPermission};
