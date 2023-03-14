const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    completed: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);

