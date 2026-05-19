const Location = require('../models/Location');
const { AppError } = require('../utils/errors');

// @desc    Get current bus location
// @route   GET /api/locations/bus/:busId
// @access  Public
exports.getBusLocation = async (req, res, next) => {
    try {
        const { busId } = req.params;

        const location = await Location.findOne({ busId })
            .sort({ timestamp: -1 })
            .populate('busId', 'registrationNumber')
            .populate('scheduleId', 'departureTime arrivalTime status');

        if (!location) {
            throw new AppError('Location not found', 404);
        }

        res.json({
            success: true,
            data: location
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get location history for schedule
// @route   GET /api/locations/schedule/:scheduleId
// @access  Public
exports.getScheduleLocations = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        const { limit = 50 } = req.query;

        const locations = await Location.find({ scheduleId })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .select('latitude longitude speed heading timestamp');

        res.json({
            success: true,
            data: locations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update bus location
// @route   POST /api/locations/update
// @access  Private/Driver
exports.updateLocation = async (req, res, next) => {
    try {
        const { busId, latitude, longitude, speed, heading, scheduleId } = req.body;

        const location = await Location.create({
            busId,
            latitude,
            longitude,
            speed,
            heading,
            scheduleId,
            timestamp: new Date()
        });

        res.json({
            success: true,
            data: location
        });
    } catch (error) {
        next(error);
    }
};
