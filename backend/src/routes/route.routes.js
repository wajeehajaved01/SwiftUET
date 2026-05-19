const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRoute, validate } = require('../middleware/validation');

// Public routes
router.get('/', routeController.getAllRoutes);
router.get('/:routeId', routeController.getRouteById);

// Protected routes - Admin only
router.use(authenticate, authorize('admin'));

router.post('/', validateRoute, validate, routeController.createRoute);
router.put('/:routeId', routeController.updateRoute);
router.delete('/:routeId', routeController.deleteRoute);

module.exports = router;
