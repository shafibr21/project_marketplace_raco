const authService = require('../services/auth.service');

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.status(201).json(result.data);
    } catch (error) {
        console.error('Error in register controller:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in login controller:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
    try {
        const result = await authService.getCurrentUser(req.user.id);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getCurrentUser controller:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};
