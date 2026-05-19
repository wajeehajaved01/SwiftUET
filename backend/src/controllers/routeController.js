const Route = require('../models/Route');
const { AppError } = require('../utils/errors');

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
exports.getAllRoutes = async (req, res, next) => {
    try {
        const { isActive } = req.query;

        const query = {};
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const routes = await Route.find(query).sort({ name: 1 });

        res.json({
            success: true,
            data: routes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get route by ID
// @route   GET /api/routes/:routeId
// @access  Public
exports.getRouteById = async (req, res, next) => {
    try {
        const route = await Route.findById(req.params.routeId);

        if (!route) {
            throw new AppError('Route not found', 404);
        }

        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new route
// @route   POST /api/routes
// @access  Private/Admin
exports.createRoute = async (req, res, next) => {
    try {
        const route = await Route.create(req.body);

        res.status(201).json({
            success: true,
            data: route
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update route
// @route   PUT /api/routes/:routeId
// @access  Private/Admin
exports.updateRoute = async (req, res, next) => {
    try {
        const route = await Route.findByIdAndUpdate(
            req.params.routeId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!route) {
            throw new AppError('Route not found', 404);
        }

        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete route
// @route   DELETE /api/routes/:routeId
// @access  Private/Admin
exports.deleteRoute = async (req, res, next) => {
    try {
        const route = await Route.findByIdAndUpdate(
            req.params.routeId,
            { isActive: false },
            { new: true }
        );

        if (!route) {
            throw new AppError('Route not found', 404);
        }

        res.json({
            success: true,
            message: 'Route deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};
