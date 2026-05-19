const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateLocation, validate } = require('../middleware/validation');

// Public routes
router.get('/bus/:busId', locationController.getBusLocation);
router.get('/schedule/:scheduleId', locationController.getScheduleLocations);

// Protected routes - Driver only
router.post('/update', authenticate, authorize('driver'), validateLocation, validate, locationController.updateLocation);

module.exports = router;
