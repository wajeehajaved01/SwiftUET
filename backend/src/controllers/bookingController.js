const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { AppError } = require('../utils/errors');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Student
exports.createBooking = async (req, res, next) => {
    try {
        const { scheduleId, seatNumber, pickupStopId, dropoffStopId } = req.body;
        const studentId = req.user.id;

        // Get schedule with bus details
        const schedule = await Schedule.findById(scheduleId).populate('busId');
        if (!schedule) {
            throw new AppError('Schedule not found', 404);
        }

        if (schedule.status !== 'scheduled') {
            throw new AppError('This schedule is not available for booking', 400);
        }

        // Check booking time (at least 30 mins before departure)
        const now = new Date();
        const departureTime = new Date(schedule.departureTime);
        const timeDiff = (departureTime - now) / (1000 * 60);

        if (timeDiff < 30) {
            throw new AppError('Bookings must be made at least 30 minutes before departure', 400);
        }

        // Check if student already has a booking for this schedule
        const existingBooking = await Booking.findOne({
            studentId,
            scheduleId,
            status: 'confirmed'
        });

        if (existingBooking) {
            throw new AppError('You already have a booking for this schedule', 400);
        }

        // Check if seat is available
        const seatBooking = await Booking.findOne({
            scheduleId,
            seatNumber,
            status: 'confirmed'
        });

        if (seatBooking) {
            throw new AppError('Seat is not available', 400);
        }

        // Check if seat is in faculty row
        const bus = schedule.busId;
        const row = Math.ceil(seatNumber / 4);
        const isFacultyRow = bus.facultyRows.includes(row);

        if (isFacultyRow) {
            const student = await User.findById(studentId);
            if (!student.isFaculty) {
                throw new AppError('This seat is reserved for faculty members', 403);
            }
        }

        // Create booking
        const booking = await Booking.create({
            studentId,
            scheduleId,
            seatNumber,
            pickupStopId,
            dropoffStopId
        });

        // Update available seats
        schedule.availableSeats -= 1;
        await schedule.save();

        // Send notification to parent
        await notificationService.notifyBookingConfirmed(studentId, booking);

        const populatedBooking = await Booking.findById(booking._id)
            .populate('scheduleId', 'departureTime arrivalTime')
            .populate('studentId', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: populatedBooking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/Student
exports.getMyBookings = async (req, res, next) => {
    try {
        const { status, limit = 20 } = req.query;
        const studentId = req.user.id;

        const query = { studentId };
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate({
                path: 'scheduleId',
                populate: [
                    { path: 'busId', select: 'registrationNumber' },
                    { path: 'routeId', select: 'name stops' }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:bookingId
// @access  Private/Student
exports.cancelBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const studentId = req.user.id;

        const booking = await Booking.findById(bookingId).populate('scheduleId');

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Verify ownership
        if (booking.studentId.toString() !== studentId) {
            throw new AppError('Unauthorized', 403);
        }

        if (booking.status !== 'confirmed') {
            throw new AppError('Booking cannot be cancelled', 400);
        }

        // Check cancellation time (at least 1 hour before departure)
        const now = new Date();
        const departureTime = new Date(booking.scheduleId.departureTime);
        const timeDiff = (departureTime - now) / (1000 * 60);

        if (timeDiff < 60) {
            throw new AppError('Cancellations must be made at least 1 hour before departure', 400);
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        // Update available seats
        const schedule = await Schedule.findById(booking.scheduleId);
        schedule.availableSeats += 1;
        await schedule.save();

        // Send notification to parent
        await notificationService.notifyBookingCancelled(studentId, booking);

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
    try {
        const { scheduleId, status, date, page = 1, limit = 20 } = req.query;

        const query = {};
        if (scheduleId) query.scheduleId = scheduleId;
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('studentId', 'firstName lastName email phoneNumber')
            .populate({
                path: 'scheduleId',
                populate: [
                    { path: 'busId', select: 'registrationNumber' },
                    { path: 'routeId', select: 'name' }
                ]
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: bookings,
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

// @desc    Get bookings by schedule
// @route   GET /api/bookings/schedule/:scheduleId
// @access  Private/Admin/Driver
exports.getBookingsBySchedule = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;

        const bookings = await Booking.find({
            scheduleId,
            status: 'confirmed'
        })
            .populate('studentId', 'firstName lastName phoneNumber')
            .sort({ seatNumber: 1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark booking as picked up
// @route   PATCH /api/bookings/:id/pickup
// @access  Private/Driver
exports.markAsPickedUp = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('studentId', 'firstName lastName phoneNumber parentId')
            .populate('scheduleId');

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        if (booking.status !== 'confirmed') {
            throw new AppError('Only confirmed bookings can be marked as picked up', 400);
        }

        // Update booking status
        booking.status = 'picked-up';
        booking.pickedUpAt = new Date();
        await booking.save();

        // Send notification to parent
        await notificationService.notifyStudentPickedUp(booking.studentId._id, booking);

        res.json({
            success: true,
            data: booking,
            message: 'Student marked as picked up successfully'
        });
    } catch (error) {
        next(error);
    }
};
