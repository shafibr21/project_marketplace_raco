const User = require('../models/User');

/**
 * Get all users from database
 * @returns {Promise<Array>} Array of users without passwords
 */
const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');
        return { success: true, data: users };
    } catch (error) {
        console.error('Error in getAllUsers service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Update user role
 * @param {String} userId - User ID
 * @param {String} role - New role (admin, buyer, solver)
 * @returns {Promise<Object>} Updated user data
 */
const updateUserRole = async (userId, role) => {
    try {
        // Validate role
        if (!['admin', 'buyer', 'solver'].includes(role)) {
            return { success: false, error: 'Invalid role', statusCode: 400 };
        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return { success: false, error: 'User not found', statusCode: 404 };
        }

        // Update role
        user.role = role;
        await user.save();

        return {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        console.error('Error in updateUserRole service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getAllUsers,
    updateUserRole
};
