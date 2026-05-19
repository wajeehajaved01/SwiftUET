const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/notifications/my-notifications - Get current user's notifications
router.get('/my-notifications', notificationController.getMyNotifications);

// POST /api/notifications/broadcast - Broadcast notification (Admin only)
router.post('/broadcast', authorize('admin'), notificationController.broadcastNotification);

module.exports = router;
