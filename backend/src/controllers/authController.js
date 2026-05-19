const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/errors');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, role, phoneNumber, isFaculty } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        // Create user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role,
            phoneNumber,
            isFaculty: role === 'student' ? isFaculty : false
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                userId: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.isActive) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if role matches (if role is provided)
        if (role && user.role !== role) {
            throw new AppError('Invalid credentials or role mismatch', 401);
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                token,
                user: {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isFaculty: user.isFaculty
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res, next) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // This endpoint can be used for token blacklisting if implemented
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};
