const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', verifyToken, authorize('admin'), userController.getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin assigns Buyer role)
// @access  Private/Admin
router.put('/:id/role', verifyToken, authorize('admin'), userController.updateUserRole);

module.exports = router;
