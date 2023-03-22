const express = require('express');
const workspaceController = require('../controllers/workspaceController');
const {check} = require("express-validator");

const router = express.Router();

validateTask = [
    check('name').notEmpty().withMessage('Name is required').isLength({min: 1}).withMessage('Name must be at least 1 character long'),
];

router.post('/', validateTask, workspaceController.createWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:id', workspaceController.getWorkspace);
router.put('/:id', validateTask, workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

module.exports = router;