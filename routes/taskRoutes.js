const express = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTask);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;