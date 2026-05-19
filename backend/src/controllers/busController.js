const Bus = require('../models/Bus');
const { AppError } = require('../utils/errors');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
exports.getAllBuses = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) query.status = status;

        const buses = await Bus.find(query)
            .populate('driverId', 'firstName lastName phoneNumber')
            .sort({ registrationNumber: 1 });

        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get bus by ID
// @route   GET /api/buses/:busId
// @access  Public
exports.getBusById = async (req, res, next) => {
    try {
        const bus = await Bus.findById(req.params.busId)
            .populate('driverId', 'firstName lastName phoneNumber email');

        if (!bus) {
            throw new AppError('Bus not found', 404);
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private/Admin
exports.createBus = async (req, res, next) => {
    try {
        const bus = await Bus.create(req.body);

        res.status(201).json({
            success: true,
            data: bus
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update bus
// @route   PUT /api/buses/:busId
// @access  Private/Admin
exports.updateBus = async (req, res, next) => {
    try {
        const bus = await Bus.findByIdAndUpdate(
            req.params.busId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!bus) {
            throw new AppError('Bus not found', 404);
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:busId
// @access  Private/Admin
exports.deleteBus = async (req, res, next) => {
    try {
        const bus = await Bus.findByIdAndUpdate(
            req.params.busId,
            { status: 'inactive' },
            { new: true }
        );

        if (!bus) {
            throw new AppError('Bus not found', 404);
        }

        res.json({
            success: true,
            message: 'Bus deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};
