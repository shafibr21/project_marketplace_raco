const userService = require('../services/user.service');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.json(result.data);
    } catch (error) {
        console.error('Error in getAllUsers controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role (Admin assigns Buyer role)
 * @access  Private/Admin
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        const result = await userService.updateUserRole(id, role);

        if (!result.success) {
            const statusCode = result.statusCode || 500;
            return res.status(statusCode).json({ message: result.error });
        }

        res.json({ 
            message: 'User role updated', 
            user: result.data 
        });
    } catch (error) {
        console.error('Error in updateUserRole controller:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole
};
