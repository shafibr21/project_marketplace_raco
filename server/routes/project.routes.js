const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const projectController = require('../controllers/project.controller');

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Buyer
router.post('/', verifyToken, authorize('buyer'), projectController.createProject);

// @route   GET /api/projects
// @desc    Get all projects (with optional filters)
// @access  Private
router.get('/', verifyToken, projectController.getAllProjects);

// @route   GET /api/projects/buyer/my-projects
// @desc    Get all projects for current buyer
// @access  Private/Buyer
router.get('/buyer/my-projects', verifyToken, authorize('buyer'), projectController.getBuyerProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', verifyToken, projectController.getProjectById);

// @route   PUT /api/projects/:id/assign
// @desc    Assign solver to project
// @access  Private/Buyer
router.put('/:id/assign', verifyToken, authorize('buyer'), projectController.assignSolverToProject);

// @route   PUT /api/projects/:id/complete
// @desc    Mark project as completed
// @access  Private/Buyer
router.put('/:id/complete', verifyToken, authorize('buyer'), projectController.markProjectCompleted);

module.exports = router;
