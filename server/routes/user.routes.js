const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const { SolverController } = require('../controllers/solver.controller');
const { buyerController } = require('../controllers/buyer.controller');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', verifyToken, authorize('admin'), userController.getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin assigns Buyer role)
// @access  Private/Admin
router.put('/:id/role', verifyToken, authorize('admin'), userController.updateUserRole);

// @route   GET /api/solver/stats
// @desc    Get solver dashboard statistics
// @access  Private/Solver
router.get('/solver/stats', verifyToken, authorize('solver'), SolverController.getSolverStats);

// @route   GET /api/buyer/stats
// @desc    Get buyer dashboard statistics
// @access  Private/Buyer
router.get('/buyer/stats', verifyToken, authorize('buyer'), buyerController.getBuyerStats);

module.exports = router;
