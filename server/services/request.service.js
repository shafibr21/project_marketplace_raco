const ProjectRequest = require('../models/ProjectRequest');
const Project = require('../models/Project');

/**
 * Create a project request (solver requests to work on project)
 * @param {Object} requestData - Request data
 * @param {String} solverId - Solver user ID
 * @returns {Promise<Object>} Created request
 */
const createProjectRequest = async (requestData, solverId) => {
    try {
        const { projectId, message } = requestData;

        // Validate project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        // Check if project is open
        if (project.status !== 'open') {
            return { success: false, error: 'Project is not open', statusCode: 400 };
        }

        // Check for existing request
        const existingRequest = await ProjectRequest.findOne({ projectId, solverId });
        if (existingRequest) {
            return { success: false, error: 'Request already sent', statusCode: 400 };
        }

        // Create new request
        const newRequest = new ProjectRequest({
            projectId,
            solverId,
            message,
        });

        await newRequest.save();

        return { success: true, data: newRequest };
    } catch (error) {
        console.error('Error in createProjectRequest service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get all requests for a specific project
 * @param {String} projectId - Project ID
 * @param {String} buyerId - Buyer user ID (for authorization)
 * @returns {Promise<Object>} List of requests
 */
const getProjectRequests = async (projectId, buyerId) => {
    try {
        // Validate project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        // Verify ownership
        if (project.buyerId.toString() !== buyerId) {
            return { success: false, error: 'Not authorized', statusCode: 401 };
        }

        // Get all requests for the project
        const requests = await ProjectRequest.find({ projectId })
            .populate('solverId', 'username email');

        return { success: true, data: requests };
    } catch (error) {
        console.error('Error in getProjectRequests service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createProjectRequest,
    getProjectRequests
};
