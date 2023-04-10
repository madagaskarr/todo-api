const express = require('express');
const storyController = require('../controllers/storyController');
const {check} = require("express-validator");

const router = express.Router();

const validateTask = [
    check('title').notEmpty().withMessage('Title is required').isLength({min: 3}).withMessage('Title must be at least 3 characters long'),
];

router.post('/', validateTask, storyController.createStory);
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStoryById);
router.put('/:id', validateTask, storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

module.exports = router;