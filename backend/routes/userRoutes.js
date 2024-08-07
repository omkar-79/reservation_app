const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// Route to create a new user
router.post('/signup', userController.createUser);

// Route to log in a user
router.post('/login', userController.loginUser);

// Example of a protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed', user: req.user });
});

module.exports = router;
