const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const { AppError } = require('../utils/errors');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
    try {
        // Get counts from all collections
        const [
            totalStudents,
            totalDrivers,
            totalBuses,
            totalRoutes,
            todayBookings,
            activeSchedules
        ] = await Promise.all([
            User.countDocuments({ role: 'student', isActive: true }),
            User.countDocuments({ role: 'driver', isActive: true }),
            Bus.countDocuments({ status: 'active' }),
            Route.countDocuments({ status: 'active' }),
            Booking.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }),
            Schedule.countDocuments({ status: 'scheduled' })
        ]);

        // Get additional analytics
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'firstName lastName email')
            .populate('schedule');

        const topRoutes = await Route.aggregate([
            { $match: { status: 'active' } },
            {
                $lookup: {
                    from: 'schedules',
                    localField: '_id',
                    foreignField: 'route',
                    as: 'schedules'
                }
            },
            {
                $addFields: {
                    scheduleCount: { $size: '$schedules' }
                }
            },
            { $sort: { scheduleCount: -1 } },
            { $limit: 5 },
            {
                $project: {
                    name: 1,
                    scheduleCount: 1,
                    status: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalStudents,
                totalDrivers,
                totalBuses,
                totalRoutes,
                todayBookings,
                activeSchedules,
                recentBookings,
                topRoutes,
                dailyRiders: todayBookings, // Alias for frontend
                activeRoutes: totalRoutes,
                fleetEfficiency: totalBuses > 0 ? Math.round((activeSchedules / totalBuses) * 100) : 0,
                avgDelay: 5 // Placeholder - implement actual delay calculation
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign driver to bus
// @route   POST /api/admin/assign-driver
// @access  Private/Admin
exports.assignDriver = async (req, res, next) => {
    try {
        const { driverId, busId } = req.body;

        if (!driverId || !busId) {
            throw new AppError('Driver ID and Bus ID are required', 400);
        }

        // Check if driver exists and is a driver
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'driver') {
            throw new AppError('Invalid driver', 404);
        }

        // Check if bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            throw new AppError('Bus not found', 404);
        }

        // Update bus with driver
        bus.driver = driverId;
        await bus.save();

        res.json({
            success: true,
            message: 'Driver assigned successfully',
            data: bus
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle faculty rows lock/unlock
// @route   POST /api/admin/toggle-faculty-rows
// @access  Private/Admin
exports.toggleFacultyRows = async (req, res, next) => {
    try {
        const { scheduleId, locked } = req.body;

        if (!scheduleId) {
            throw new AppError('Schedule ID is required', 400);
        }

        if (typeof locked !== 'boolean') {
            throw new AppError('Locked must be a boolean value', 400);
        }

        // Update schedule
        const schedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            { facultyRowsLocked: locked },
            { new: true, runValidators: true }
        );

        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        res.json({
            success: true,
            message: `Faculty rows ${locked ? 'locked' : 'unlocked'} successfully`,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send broadcast notification
// @route   POST /api/admin/broadcast
// @access  Private/Admin
exports.sendBroadcast = async (req, res, next) => {
    try {
        const { message, targetAudience, urgency } = req.body;

        if (!message) {
            throw new AppError('Message is required', 400);
        }

        // Get target users based on audience
        let query = { isActive: true };
        if (targetAudience && targetAudience !== 'all') {
            query.role = targetAudience;
        }

        const users = await User.find(query).select('phoneNumber email firstName');
        const recipientCount = users.length;

        // TODO: Integrate with Twilio to send actual SMS
        // For now, just return success
        console.log(`Broadcasting to ${recipientCount} users: ${message}`);

        res.json({
            success: true,
            message: 'Broadcast sent successfully',
            data: {
                recipientCount,
                timestamp: new Date(),
                message,
                targetAudience,
                urgency
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get broadcast history
// @route   GET /api/admin/broadcast-history
// @access  Private/Admin
exports.getBroadcastHistory = async (req, res, next) => {
    try {
        // TODO: Implement broadcast history from database
        // For now, return empty array
        res.json({
            success: true,
            data: []
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Get bookings trend
        const bookingsTrend = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 7 }
        ]);

        // Get route usage
        const routeUsage = await Schedule.aggregate([
            {
                $lookup: {
                    from: 'routes',
                    localField: 'route',
                    foreignField: '_id',
                    as: 'routeInfo'
                }
            },
            { $unwind: '$routeInfo' },
            {
                $group: {
                    _id: '$route',
                    name: { $first: '$routeInfo.name' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                bookingsTrend,
                routeUsage
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
