const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBus, validate } = require('../middleware/validation');

// Public routes
router.get('/', busController.getAllBuses);
router.get('/:busId', busController.getBusById);

// Protected routes - Admin only
router.use(authenticate, authorize('admin'));

router.post('/', validateBus, validate, busController.createBus);
router.put('/:busId', busController.updateBus);
router.delete('/:busId', busController.deleteBus);

module.exports = router;
