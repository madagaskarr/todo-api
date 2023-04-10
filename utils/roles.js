const {Role} = require("../models/workspaceModel")
const {AbilityBuilder, createMongoAbility} = require("@casl/ability");

const permissions = {
    TASK_VIEW: "view_task",
    TASK_CREATE: "create_task",
    TASK_EDIT: "edit_task",
    TASK_DELETE: "delete_task",
    WORKSPACE_VIEW: "view_workspace",
    WORKSPACE_CREATE: "create_workspace",
    WORKSPACE_EDIT: "edit_workspace",
    WORKSPACE_DELETE: "delete_workspace",
};

function defineAbilitiesFor(role) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    switch (role) {
        case Role.ADMIN:
            can(permissions.TASK_VIEW, "Task");
            can(permissions.TASK_CREATE, "Task");
            can(permissions.TASK_EDIT, "Task");
            can(permissions.TASK_DELETE, "Task");
            can(permissions.WORKSPACE_VIEW, "Workspace");
            can(permissions.WORKSPACE_CREATE, "Workspace");
            can(permissions.WORKSPACE_EDIT, "Workspace");
            can(permissions.WORKSPACE_DELETE, "Workspace");
            break;

        case Role.MEMBER:
            can(permissions.TASK_VIEW, "Task");
            can(permissions.TASK_CREATE, "Task");
            can(permissions.TASK_EDIT, "Task");
            can(permissions.TASK_DELETE, "Task");
            can(permissions.WORKSPACE_VIEW, "Workspace");
            can(permissions.WORKSPACE_CREATE, "Workspace");
            can(permissions.WORKSPACE_EDIT, "Workspace");
            cannot(permissions.WORKSPACE_DELETE, "Workspace");
            break;

        case Role.GUEST:
            can(permissions.TASK_VIEW, "Task");
            cannot(permissions.TASK_CREATE, "Task");
            cannot(permissions.TASK_EDIT, "Task");
            cannot(permissions.TASK_DELETE, "Task");
            can(permissions.WORKSPACE_VIEW, "Workspace");
            cannot(permissions.WORKSPACE_CREATE, "Workspace");
            cannot(permissions.WORKSPACE_EDIT, "Workspace");
            cannot(permissions.WORKSPACE_DELETE, "Workspace");
            break;

        default:
            cannot("*");
    }

    return build();
}

module.exports = { defineAbilitiesFor, permissions };
