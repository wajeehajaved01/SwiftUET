const User = require('../models/User');
const { AppError } = require('../utils/errors');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('parentId', 'firstName lastName email phoneNumber')
            .populate('studentIds', 'firstName lastName email');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, phoneNumber },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:userId
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('parentId', 'firstName lastName email phoneNumber')
            .populate('studentIds', 'firstName lastName email');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, role, isActive, isFaculty } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { firstName, lastName, phoneNumber, role, isActive, isFaculty },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Link parent to student
// @route   POST /api/users/:userId/link-parent
// @access  Private/Admin
exports.linkParent = async (req, res, next) => {
    try {
        const { parentId } = req.body;
        const studentId = req.params.userId;

        // Verify student exists and is a student
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            throw new AppError('Student not found', 404);
        }

        // Verify parent exists and is a parent
        const parent = await User.findById(parentId);
        if (!parent || parent.role !== 'parent') {
            throw new AppError('Parent not found', 404);
        }

        // Link parent to student
        student.parentId = parentId;
        await student.save();

        // Add student to parent's studentIds
        if (!parent.studentIds.includes(studentId)) {
            parent.studentIds.push(studentId);
            await parent.save();
        }

        res.json({
            success: true,
            message: 'Parent linked successfully'
        });
    } catch (error) {
        next(error);
    }
};
