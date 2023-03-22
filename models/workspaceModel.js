const mongoose = require("mongoose");

const RoleEnum = {
    VIEWER: "viewer", EDITOR: "editor", ADMIN: "admin",
};

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    }, role: {
        type: String, enum: Object.values(RoleEnum), default: RoleEnum.EDITOR,
    },
});

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    }, owner: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    }, members: [memberSchema],
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = {
    Workspace,
    RoleEnum,
};