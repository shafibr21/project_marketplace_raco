const projectService = require('../services/project.service');

/**
 * @route   POST /api/projects
 * @desc    Create a project
 * @access  Private/Buyer
 */
const createProject = async (req, res) => {
    try {
        const result = await projectService.createProject(req.body, req.user.id);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in createProject controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/projects
 * @desc    Get all projects (with optional filters)
 * @access  Private
 */
const getAllProjects = async (req, res) => {
    try {
        const result = await projectService.getAllProjects(req.query, req.user);

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
 * @route   GET /api/projects/buyer/my-projects
 * @desc    Get all projects for current buyer
 * @access  Private/Buyer
 */
const getBuyerProjects = async (req, res) => {
    try {
        const result = await projectService.getBuyerProjects(req.user.id);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getBuyerProjects controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
const getProjectById = async (req, res) => {
    try {
        const result = await projectService.getProjectById(req.params.id);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getProjectById controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   PUT /api/projects/:id/assign
 * @desc    Assign solver to project
 * @access  Private/Buyer
 */
const assignSolverToProject = async (req, res) => {
    try {
        const { solverId } = req.body;
        const result = await projectService.assignSolverToProject(
            req.params.id,
            solverId,
            req.user.id
        );

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in assignSolverToProject controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   PUT /api/projects/:id/complete
 * @desc    Mark project as completed
 * @access  Private/Buyer
 */
const markProjectCompleted = async (req, res) => {
    try {
        const result = await projectService.markProjectCompleted(
            req.params.id,
            req.user.id
        );

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json({ message: 'Project marked as completed', project: result.data });
    } catch (error) {
        console.error('Error in markProjectCompleted controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
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
