const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../utils/errors');

// Middleware to check validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        return next(new AppError(errorMessages, 400));
    }
    next();
};

// User validation rules
exports.validateRegister = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('role').isIn(['student', 'driver', 'admin', 'parent']).withMessage('Invalid role'),
    body('phoneNumber').matches(/^\+92\d{10}$/).withMessage('Phone number must be in format +92XXXXXXXXXX')
];

exports.validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Booking validation rules
exports.validateBooking = [
    body('scheduleId').isMongoId().withMessage('Valid schedule ID is required'),
    body('seatNumber').isInt({ min: 1 }).withMessage('Valid seat number is required'),
    body('pickupStopId').isMongoId().withMessage('Valid pickup stop ID is required'),
    body('dropoffStopId').isMongoId().withMessage('Valid dropoff stop ID is required')
];

// Schedule validation rules
exports.validateSchedule = [
    body('busId').isMongoId().withMessage('Valid bus ID is required'),
    body('routeId').isMongoId().withMessage('Valid route ID is required'),
    body('driverId').isMongoId().withMessage('Valid driver ID is required'),
    body('departureTime').isISO8601().withMessage('Valid departure time is required'),
    body('arrivalTime').isISO8601().withMessage('Valid arrival time is required'),
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
];

// Route validation rules
exports.validateRoute = [
    body('name').trim().notEmpty().withMessage('Route name is required'),
    body('stops').isArray({ min: 2 }).withMessage('Route must have at least 2 stops'),
    body('stops.*.name').trim().notEmpty().withMessage('Stop name is required'),
    body('stops.*.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    body('stops.*.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
    body('stops.*.order').isInt({ min: 1 }).withMessage('Valid stop order is required'),
    body('distance').isFloat({ min: 0 }).withMessage('Valid distance is required'),
    body('estimatedDuration').isInt({ min: 1 }).withMessage('Valid estimated duration is required')
];

// Bus validation rules
exports.validateBus = [
    body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
    body('capacity').isInt({ min: 10, max: 60 }).withMessage('Capacity must be between 10 and 60'),
    body('status').optional().isIn(['active', 'maintenance', 'inactive']).withMessage('Invalid status')
];

// Location validation rules
exports.validateLocation = [
    body('busId').isMongoId().withMessage('Valid bus ID is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
    body('speed').optional().isFloat({ min: 0 }).withMessage('Speed must be non-negative'),
    body('heading').optional().isFloat({ min: 0, max: 360 }).withMessage('Heading must be between 0 and 360')
];

// MongoDB ID validation
exports.validateMongoId = (paramName) => [
    param(paramName).isMongoId().withMessage(`Valid ${paramName} is required`)
];
