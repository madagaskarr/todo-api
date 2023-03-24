const Task = require("../models/taskModel");

exports.createTask = async (user, taskData) => {
    const {title, description, workspace } = taskData;
    const task = new Task({ title, description, user, workspace });
    await task.save();
    return task;
};

exports.getTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, user: userId });
    return task ? task : false;
};

exports.getAllTasks = async (userId) => {
    return Task.find({user: userId});
};

exports.updateTask = async (taskId, userId, updateData) => {
    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        updateData,
        { new: true }
    );
    return updatedTask ? updatedTask : false;
};

exports.deleteTask = async (taskId, userId) => {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    return !!task;
};
