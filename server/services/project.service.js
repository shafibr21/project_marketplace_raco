const Project = require('../models/Project');

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {String} buyerId - Buyer user ID
 * @returns {Promise<Object>} Created project
 */
const createProject = async (projectData, buyerId) => {
    try {
        const { title, description, budget } = projectData;

        const newProject = new Project({
            title,
            description,
            budget,
            buyerId,
        });

        const project = await newProject.save();

        return { success: true, data: project };
    } catch (error) {
        console.error('Error in createProject service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get all projects with optional filters
 * @param {Object} filters - Query filters
 * @param {Object} user - Current user data
 * @returns {Promise<Object>} List of projects
 */
const getAllProjects = async (filters, user) => {
    try {
        let query = {};

        // Filter by buyer's own projects
        if (user.role === 'buyer' && filters.mine) {
            query.buyerId = user.id;
        }

        // Filter open projects for solvers
        if (user.role === 'solver' && filters.open) {
            query.status = 'open';
        }

        // Filter assigned projects for solvers
        if (user.role === 'solver' && filters.assigned) {
            query.assignedSolverId = user.id;
        }

        const projects = await Project.find(query)
            .populate('buyerId', 'username')
            .populate('assignedSolverId', 'username');

        return { success: true, data: projects };
    } catch (error) {
        console.error('Error in getAllProjects service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get all projects for a specific buyer
 * @param {String} buyerId - Buyer user ID
 * @returns {Promise<Object>} List of buyer's projects
 */
const getBuyerProjects = async (buyerId) => {
    try {
        const projects = await Project.find({ buyerId })
            .populate('buyerId', 'username email')
            .populate('assignedSolverId', 'username email')
            .sort({ createdAt: -1 });

        return { success: true, data: projects };
    } catch (error) {
        console.error('Error in getBuyerProjects service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get project by ID
 * @param {String} projectId - Project ID
 * @returns {Promise<Object>} Project data
 */
const getProjectById = async (projectId) => {
    try {
        const project = await Project.findById(projectId)
            .populate('buyerId', 'username')
            .populate('assignedSolverId', 'username');

        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        return { success: true, data: project };
    } catch (error) {
        console.error('Error in getProjectById service:', error.message);
        
        if (error.kind === 'ObjectId') {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }
        
        return { success: false, error: error.message };
    }
};

/**
 * Assign solver to project
 * @param {String} projectId - Project ID
 * @param {String} solverId - Solver user ID
 * @param {String} buyerId - Buyer user ID (for authorization)
 * @returns {Promise<Object>} Updated project
 */
const assignSolverToProject = async (projectId, solverId, buyerId) => {
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        // Verify ownership
        if (project.buyerId.toString() !== buyerId) {
            return { success: false, error: 'Not authorized', statusCode: 401 };
        }

        project.assignedSolverId = solverId;
        project.status = 'assigned';

        await project.save();

        return { success: true, data: project };
    } catch (error) {
        console.error('Error in assignSolverToProject service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Mark project as completed
 * @param {String} projectId - Project ID
 * @param {String} buyerId - Buyer user ID (for authorization)
 * @returns {Promise<Object>} Updated project
 */
const markProjectCompleted = async (projectId, buyerId) => {
    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return { success: false, error: 'Project not found', statusCode: 404 };
        }

        // Verify ownership
        if (project.buyerId.toString() !== buyerId) {
            return { success: false, error: 'Not authorized', statusCode: 401 };
        }

        // Update project status to completed
        project.status = 'completed';
        await project.save();

        return { success: true, data: project };
    } catch (error) {
        console.error('Error in markProjectCompleted service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    getBuyerProjects,
    assignSolverToProject,
    markProjectCompleted
};
