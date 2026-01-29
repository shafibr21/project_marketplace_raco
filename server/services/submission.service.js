const Submission = require('../models/Submission');
const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Create a submission for a task
 * @param {String} taskId - Task ID
 * @param {String} solverId - Solver user ID
 * @param {String} filePath - Path to uploaded file
 * @returns {Promise<Object>} Created submission
 */
const createSubmission = async (taskId, solverId, filePath) => {
    try {
        // Validate task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return { success: false, error: 'Task not found', statusCode: 404 };
        }

        // Verify solver is assigned to the task
        if (task.solverId.toString() !== solverId) {
            return { success: false, error: 'Not authorized', statusCode: 401 };
        }

        // Create submission
        const submission = new Submission({
            taskId,
            solverId,
            filePath,
        });

        await submission.save();

        // Update task status
        task.status = 'submitted';
        await task.save();

        return { success: true, data: submission };
    } catch (error) {
        console.error('Error in createSubmission service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get all submissions for a task
 * @param {String} taskId - Task ID
 * @returns {Promise<Object>} List of submissions
 */
const getTaskSubmissions = async (taskId) => {
    try {
        const submissions = await Submission.find({ taskId })
            .populate('solverId', 'username');

        return { success: true, data: submissions };
    } catch (error) {
        console.error('Error in getTaskSubmissions service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Review submission (accept or reject)
 * @param {String} submissionId - Submission ID
 * @param {String} status - New status (accepted/rejected)
 * @param {String} buyerId - Buyer user ID (for authorization)
 * @returns {Promise<Object>} Updated submission
 */
const reviewSubmission = async (submissionId, status, buyerId) => {
    try {
        // Validate status
        if (!['accepted', 'rejected'].includes(status)) {
            return { success: false, error: 'Invalid status', statusCode: 400 };
        }

        // Find submission
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return { success: false, error: 'Submission not found', statusCode: 404 };
        }

        // Validate ownership via task -> project
        const task = await Task.findById(submission.taskId);
        const project = await Project.findById(task.projectId);

        if (project.buyerId.toString() !== buyerId) {
            return { success: false, error: 'Not authorized', statusCode: 401 };
        }

        // Update submission status
        submission.status = status;
        await submission.save();

        // Update task status based on review
        if (status === 'accepted') {
            task.status = 'completed';
        } else if (status === 'rejected') {
            task.status = 'pending'; // Allow resubmission
        }
        await task.save();

        return { success: true, data: submission };
    } catch (error) {
        console.error('Error in reviewSubmission service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createSubmission,
    getTaskSubmissions,
    reviewSubmission
};
