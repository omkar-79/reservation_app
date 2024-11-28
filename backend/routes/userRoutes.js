const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const { getReserveeProfile } = require('../controllers/userController');

// Route to get user profile
router.get('/reservee', authenticateToken, getReserveeProfile);


// Route to create a new user
router.post('/signup', userController.createUser);

// Route to log in a user
router.post('/login', userController.loginUser);

// Route for Google Sign-In
router.post('/google-signin', userController.googleSignIn);


module.exports = router;
