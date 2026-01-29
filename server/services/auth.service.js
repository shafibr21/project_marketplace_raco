const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Token and user data
 */
const registerUser = async (userData) => {
    try {
        const { username, email, password, role } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, error: 'User already exists', statusCode: 400 };
        }

        // Create new user
        const userRole = role || 'solver';
        const user = new User({
            username,
            email,
            password,
            role: userRole,
        });

        await user.save();

        // Generate JWT token
        const payload = {
            id: user.id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        };
    } catch (error) {
        console.error('Error in registerUser service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} Token and user data
 */
const loginUser = async (credentials) => {
    try {
        const { email, password } = credentials;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, error: 'Invalid Credentials', statusCode: 400 };
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return { success: false, error: 'Invalid Credentials', statusCode: 400 };
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        };
    } catch (error) {
        console.error('Error in loginUser service:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Get current user by ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} User data without password
 */
const getCurrentUser = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return { success: false, error: 'User not found', statusCode: 404 };
        }

        return { success: true, data: user };
    } catch (error) {
        console.error('Error in getCurrentUser service:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};
