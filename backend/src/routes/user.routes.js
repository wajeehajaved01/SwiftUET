const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/users/me - Get current user profile
router.get('/me', userController.getMe);

// PUT /api/users/me - Update current user profile
router.put('/me', userController.updateMe);

// Admin only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:userId', authorize('admin'), userController.getUserById);
router.put('/:userId', authorize('admin'), userController.updateUser);
router.delete('/:userId', authorize('admin'), userController.deleteUser);

// Link parent to student
router.post('/:userId/link-parent', authorize('admin'), userController.linkParent);

module.exports = router;
