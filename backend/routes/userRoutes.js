const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { getReserveeProfile } = require('../controllers/userController');

// Route to get user profile
router.get('/users/reservee', authenticateToken, getReserveeProfile);

// Route to create a new user
router.post('/users/signup', userController.createUser);

// Route to log in a user
router.post('/users/login', userController.loginUser);

// Add this new route
router.get('/users/check-auth', userController.checkAuth);

module.exports = router;
