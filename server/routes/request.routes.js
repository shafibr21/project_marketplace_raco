const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const requestController = require('../controllers/request.controller');

// @route   POST /api/requests
// @desc    Solver requests to work on a project
// @access  Private/Solver
router.post('/', verifyToken, authorize('solver'), requestController.createProjectRequest);

// @route   GET /api/requests/project/:projectId
// @desc    Get all requests for a project
// @access  Private/Buyer
router.get('/project/:projectId', verifyToken, authorize('buyer'), requestController.getProjectRequests);

module.exports = router;
