const express = require('express');
const taskController = require('../controllers/taskController');
const taskValidator = require("../validators/taskValidator")

const router = express.Router();

router.post('/', taskValidator.validateTask, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskValidator.validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;