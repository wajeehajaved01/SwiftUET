const Notification = require('../models/Notification');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { AppError } = require('../utils/errors');

// @desc    Get my notifications
// @route   GET /api/notifications/my-notifications
// @access  Private
exports.getMyNotifications = async (req, res, next) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        const recipientId = req.user.id;

        const notifications = await Notification.find({ recipientId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Notification.countDocuments({ recipientId });

        res.json({
            success: true,
            data: notifications,
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

// @desc    Broadcast notification
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res, next) => {
    try {
        const { message, targetRole, type = 'sms' } = req.body;

        if (!message) {
            throw new AppError('Message is required', 400);
        }

        // Get target users
        const query = {};
        if (targetRole) query.role = targetRole;

        const users = await User.find(query).select('_id phoneNumber');

        if (users.length === 0) {
            throw new AppError('No users found', 404);
        }

        // Send notifications
        const results = await notificationService.broadcastNotification(users, message, type);

        res.json({
            success: true,
            message: `Notification sent to ${results.success} users`,
            data: {
                total: users.length,
                success: results.success,
                failed: results.failed
            }
        });
    } catch (error) {
        next(error);
    }
};
