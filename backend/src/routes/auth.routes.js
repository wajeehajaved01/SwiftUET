const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validate } = require('../middleware/validation');

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, validate, authController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, validate, authController.login);

// POST /api/auth/logout - Logout user (optional, for token blacklisting)
router.post('/logout', authController.logout);

module.exports = router;
