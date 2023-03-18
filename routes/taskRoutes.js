const express = require('express');
const taskController = require('../controllers/taskController');
const {check} = require("express-validator");


const router = express.Router();

validateTask = [
    check('title').notEmpty().withMessage('Title is required').isLength({min: 1}).withMessage('Title must be at least 1 character long'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];

router.post('/', validateTask, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;