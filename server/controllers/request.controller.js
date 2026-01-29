const requestService = require('../services/request.service');

/**
 * @route   POST /api/requests
 * @desc    Solver requests to work on a project
 * @access  Private/Solver
 */
const createProjectRequest = async (req, res) => {
    try {
        const result = await requestService.createProjectRequest(req.body, req.user.id);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in createProjectRequest controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/requests/project/:projectId
 * @desc    Get all requests for a project
 * @access  Private/Buyer
 */
const getProjectRequests = async (req, res) => {
    try {
        const result = await requestService.getProjectRequests(
            req.params.projectId,
            req.user.id
        );

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getProjectRequests controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createProjectRequest,
    getProjectRequests
};
