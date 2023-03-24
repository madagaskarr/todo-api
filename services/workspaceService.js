const {Workspace} = require("../models/workspaceModel");

exports.createWorkspace = async (name, owner) => {
    const workspace = new Workspace({ name, owner });
    await workspace.save();
    return workspace;
};

exports.getWorkspaces = async (userId) => {
    return Workspace.find({ owner: userId });
};

exports.getWorkspaceById = async (workspaceId, userId) => {
    return Workspace.findOne({ _id: workspaceId, owner: userId });
};

exports.updateWorkspace = async (workspaceId, userId, updates) => {
    const workspace = await Workspace.findOne({_id: workspaceId, owner: userId});

    if (!workspace) {
        return null;
    }

    Object.assign(workspace, updates);
    await workspace.save();
    return workspace;
}

exports.deleteWorkspace = async (workspaceId, userId) => {
    return Workspace.findOneAndDelete({ _id: workspaceId, owner: userId });
};