const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get('/stats', verifyToken, authorize('admin'), adminController.getPlatformStats);

// @route   GET /api/admin/projects
// @desc    Get all projects with full details
// @access  Private/Admin
router.get('/projects', verifyToken, authorize('admin'), adminController.getAllProjects);

module.exports = router;
