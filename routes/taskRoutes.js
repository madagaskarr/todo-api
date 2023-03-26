const express = require('express');
const taskController = require('../controllers/taskController');
const taskValidator = require("../validators/taskValidator")
const objectIdValidator = require("../middleware/objectIDMiddleware");
const rbac = require("../middleware/rbacMiddleware")
const {Permissions} = require("../utils/roles")
const router = express.Router();

router.post(
    '/',
    taskValidator.validateTask,
    rbac(Permissions.TASK_CREATE),
    taskController.createTask);

router.get(
    '/',
    taskController.getTasks);

router.get(
    '/:id',
    objectIdValidator,
    rbac(Permissions.TASK_VIEW),
    taskController.getTask);

router.put(
    '/:id',
    objectIdValidator,
    taskValidator.validateTask,
    rbac(Permissions.TASK_EDIT),
    taskController.updateTask);

router.delete(
    '/:id',
    objectIdValidator,
    rbac(Permissions.TASK_DELETE),
    taskController.deleteTask);

module.exports = router;