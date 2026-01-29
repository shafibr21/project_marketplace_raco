const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken, authorize } = require('../middleware/auth');
const submissionController = require('../controllers/submission.controller');

// @route   POST /api/submissions/:taskId
// @desc    Upload ZIP submission for a task
// @access  Private/Solver
router.post('/:taskId', verifyToken, authorize('solver'), upload.single('file'), submissionController.createSubmission);

// @route   GET /api/submissions/task/:taskId
// @desc    Get submissions for a task
// @access  Private
router.get('/task/:taskId', verifyToken, submissionController.getTaskSubmissions);

// @route   PUT /api/submissions/:id/review
// @desc    Accept or Reject submission
// @access  Private/Buyer
router.put('/:id/review', verifyToken, authorize('buyer'), submissionController.reviewSubmission);

module.exports = router;
