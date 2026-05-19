const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

// Dashboard statistics
router.get('/dashboard', adminController.getDashboard);

// Driver assignment
router.post('/assign-driver', adminController.assignDriver);

// Faculty rows toggle
router.post('/toggle-faculty-rows', adminController.toggleFacultyRows);

// Broadcast notifications
router.post('/broadcast', adminController.sendBroadcast);
router.get('/broadcast-history', adminController.getBroadcastHistory);

// Analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
