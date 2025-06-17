const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user route
router.get('/me', authenticate, authController.getCurrentUser);

// Get all users route (for member selection)
router.get('/users', authenticate, authController.getAllUsers);

module.exports = router;