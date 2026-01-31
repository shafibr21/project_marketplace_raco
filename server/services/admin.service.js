const User = require('../models/User');
const Project = require('../models/Project');

/**
 * Get all projects with full details
 * @returns {Promise<Object>} All projects with buyer and solver information
 */
const getAllProjects = async () => {
    try {
        const projects = await Project.find()
            .populate('buyerId', 'username email role')
            .populate('assignedSolverId', 'username email role')
            .sort({ createdAt: -1 });

        return { success: true, data: projects };
    } catch (error) {
        console.error('Error in getAllProjects service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get platform statistics
 * @returns {Promise<Object>} Statistics including user count, project count, and total volume
 */
const getPlatformStats = async () => {
    try {
        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();

        // Calculate total volume (sum of budgets for completed projects only)
        const completedProjects = await Project.find({ status: 'completed' });
        const totalVolume = completedProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

        return {
            success: true,
            data: {
                users: userCount,
                projects: projectCount,
                volume: totalVolume
            }
        };
    } catch (error) {
        console.error('Error in getPlatformStats service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getPlatformStats,
    getAllProjects
};
