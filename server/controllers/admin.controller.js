const adminService = require('../services/admin.service');

/**
 * @route   GET /api/admin/projects
 * @desc    Get all projects with full details
 * @access  Private/Admin
 */
const getAllProjects = async (req, res) => {
    try {
        const result = await adminService.getAllProjects();

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getAllProjects controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Private/Admin
 */
const getPlatformStats = async (req, res) => {
    try {
        const result = await adminService.getPlatformStats();

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getPlatformStats controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPlatformStats,
    getAllProjects
};
