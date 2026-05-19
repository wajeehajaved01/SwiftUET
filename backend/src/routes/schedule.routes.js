const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateSchedule, validate } = require('../middleware/validation');

// Public routes
router.get('/', scheduleController.getAllSchedules);
router.get('/:scheduleId', scheduleController.getScheduleById);

// Protected routes
router.use(authenticate);

// Admin only routes
router.post('/', authorize('admin'), validateSchedule, validate, scheduleController.createSchedule);
router.put('/:scheduleId', authorize('admin'), scheduleController.updateSchedule);
router.delete('/:scheduleId', authorize('admin'), scheduleController.deleteSchedule);

// Driver routes
router.put('/:scheduleId/status', authorize('driver', 'admin'), scheduleController.updateStatus);

module.exports = router;
