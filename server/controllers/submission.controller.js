const submissionService = require('../services/submission.service');

/**
 * @route   POST /api/submissions/:taskId
 * @desc    Upload ZIP submission for a task
 * @access  Private/Solver
 */
const createSubmission = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a ZIP file' });
        }

        const result = await submissionService.createSubmission(
            req.params.taskId,
            req.user.id,
            req.file.path
        );

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in createSubmission controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/submissions/task/:taskId
 * @desc    Get submissions for a task
 * @access  Private
 */
const getTaskSubmissions = async (req, res) => {
    try {
        const result = await submissionService.getTaskSubmissions(req.params.taskId);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getTaskSubmissions controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   PUT /api/submissions/:id/review
 * @desc    Accept or Reject submission
 * @access  Private/Buyer
 */
const reviewSubmission = async (req, res) => {
    try {
        const { status } = req.body;

        const result = await submissionService.reviewSubmission(
            req.params.id,
            status,
            req.user.id
        );

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in reviewSubmission controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createSubmission,
    getTaskSubmissions,
    reviewSubmission
};
