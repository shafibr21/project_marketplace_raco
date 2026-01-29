const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {String} solverId - Solver user ID
 * @returns {Promise<Object>} Created task
 */
const createTask = async (taskData, solverId) => {
    try {
        const { title, description, projectId, timeline } = taskData;

        // Validate project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        // Verify user is the assigned solver
        if (project.assignedSolverId.toString() !== solverId) {
            return {
                success: false,
                error: 'Not authorized: You are not the assigned solver',
                statusCode: 401
            };
        }

        // Create task
        const newTask = new Task({
            title,
            description,
            projectId,
            solverId,
            timeline,
        });

        await newTask.save();

        return { success: true, data: newTask };
    } catch (error) {
        console.error('Error in createTask service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get all tasks for a project
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} List of tasks
 */
const getProjectTasks = async (projectId) => {
    try {
        const tasks = await Task.find({ projectId });

        return { success: true, data: tasks };
    } catch (error) {
        console.error('Error in getProjectTasks service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createTask,
    getProjectTasks
};
