const Task = require("../models/taskModel");

exports.createTask = async (user, taskData) => {
    const {title, description, workspace} = taskData;
    const task = new Task({title, description, user, workspace});
    await task.save();
    return task;
};

exports.getAllTasks = async (userId) => {
    return Task.find({user: userId});
};

exports.getTask = async (taskId, userId) => {
    return Task.findOne({_id: taskId, user: userId});
};

exports.updateTask = async (taskId, userId, updateData) => {
    return Task.findOneAndUpdate(
        {_id: taskId, user: userId},
        updateData,
        {new: true}
    );
};

exports.deleteTask = async (taskId, userId) => {
    return Task.findOneAndDelete({_id: taskId, user: userId});
};
