const {Workspace, RoleEnum} = require("../models/workspaceModel");

exports.createWorkspace = async (userid, data) => {
    const {name} = data;
    const workspace = new Workspace({name, owner: userid});
    workspace.members.push({user: userid, role: RoleEnum.ADMIN});
    await workspace.save();
    return workspace;
};

exports.getWorkspaces = async (userId, filter) => {
    let filterObj;
    switch (filter) {
        case 'owner':
            filterObj = {owner: userId};
            break;
        case 'member':
            filterObj = {"members.user": userId};
            break;
        case 'invited':
            filterObj = {owner: {$ne: userId}, "members.user": userId};
            break;
        default:
            filterObj = {"members.user": userId};
            break;
    }

    return Workspace.find(filterObj);
};

exports.getWorkspaceById = async (workspaceId, userId) => {
    return Workspace.findOne({_id: workspaceId, 'members.user': userId});
};

exports.updateWorkspace = async (workspaceId, userId, updates) => {
    return Workspace.findOneAndUpdate(
        {_id: workspaceId, owner: userId},
        updates,
        {new: true}
    );
};

exports.deleteWorkspace = async (workspaceId, userId) => {
    return Workspace.findOneAndDelete({_id: workspaceId, owner: userId});
};