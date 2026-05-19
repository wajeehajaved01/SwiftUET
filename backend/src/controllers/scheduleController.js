const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const { AppError } = require('../utils/errors');

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Public
exports.getAllSchedules = async (req, res, next) => {
    try {
        const { date, status, busId } = req.query;

        const query = {};
        if (date) query.date = date;
        if (status) query.status = status;
        if (busId) query.busId = busId;

        const schedules = await Schedule.find(query)
            .populate('busId', 'registrationNumber capacity')
            .populate('routeId', 'name stops')
            .populate('driverId', 'firstName lastName phoneNumber')
            .sort({ departureTime: 1 });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get schedule by ID
// @route   GET /api/schedules/:scheduleId
// @access  Public
exports.getScheduleById = async (req, res, next) => {
    try {
        const schedule = await Schedule.findById(req.params.scheduleId)
            .populate('busId')
            .populate('routeId')
            .populate('driverId', 'firstName lastName phoneNumber email');

        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        res.json({
            success: true,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private/Admin
exports.createSchedule = async (req, res, next) => {
    try {
        const { busId, routeId, driverId, departureTime, arrivalTime, date } = req.body;

        // Get bus capacity
        const bus = await Bus.findById(busId);
        if (!bus) {
            throw new AppError('Bus not found', 404);
        }

        // Create schedule with available seats equal to bus capacity
        const schedule = await Schedule.create({
            busId,
            routeId,
            driverId,
            departureTime,
            arrivalTime,
            date,
            availableSeats: bus.capacity
        });

        const populatedSchedule = await Schedule.findById(schedule._id)
            .populate('busId', 'registrationNumber capacity')
            .populate('routeId', 'name')
            .populate('driverId', 'firstName lastName');

        res.status(201).json({
            success: true,
            data: populatedSchedule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:scheduleId
// @access  Private/Admin
exports.updateSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.scheduleId,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('busId', 'registrationNumber capacity')
            .populate('routeId', 'name')
            .populate('driverId', 'firstName lastName');

        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        res.json({
            success: true,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:scheduleId
// @access  Private/Admin
exports.deleteSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.scheduleId,
            { status: 'cancelled' },
            { new: true }
        );

        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        res.json({
            success: true,
            message: 'Schedule cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update schedule status
// @route   PUT /api/schedules/:scheduleId/status
// @access  Private/Driver/Admin
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const updateData = { status };

        // Set actual times based on status
        if (status === 'in-progress') {
            updateData.actualDepartureTime = new Date();
        } else if (status === 'completed') {
            updateData.actualArrivalTime = new Date();
        }

        const schedule = await Schedule.findByIdAndUpdate(
            req.params.scheduleId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        res.json({
            success: true,
            data: schedule
        });
    } catch (error) {
        next(error);
    }
};
