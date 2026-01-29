const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const taskController = require('../controllers/task.controller');

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private/Solver
router.post('/', verifyToken, authorize('solver'), taskController.createTask);

// @route   GET /api/tasks/project/:projectId
// @desc    Get tasks for a project
// @access  Private (Buyer, Solver, Admin)
router.get('/project/:projectId', verifyToken, taskController.getProjectTasks);

module.exports = router;
