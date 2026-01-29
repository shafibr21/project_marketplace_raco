const taskService = require('../services/task.service');

/**
 * @route   POST /api/tasks
 * @desc    Create a task
 * @access  Private/Solver
 */
const createTask = async (req, res) => {
    try {
        const result = await taskService.createTask(req.body, req.user.id);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in createTask controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/tasks/project/:projectId
 * @desc    Get tasks for a project
 * @access  Private (Buyer, Solver, Admin)
 */
const getProjectTasks = async (req, res) => {
    try {
        const result = await taskService.getProjectTasks(req.params.projectId);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getProjectTasks controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTask,
    getProjectTasks
};
