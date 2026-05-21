const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBooking, validate } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', authorize('student'), validateBooking, validate, bookingController.createBooking);
router.get('/my-bookings', authorize('student'), bookingController.getMyBookings);
router.delete('/:bookingId', authorize('student'), bookingController.cancelBooking);

// Admin routes
router.get('/', authorize('admin'), bookingController.getAllBookings);

// Admin and Driver routes
router.get('/schedule/:scheduleId', authorize('admin', 'driver'), bookingController.getBookingsBySchedule);

// Driver routes
router.patch('/:id/pickup', authorize('driver', 'admin'), bookingController.markAsPickedUp);

module.exports = router;
