const express = require('express');
const router = express.Router();
const groundController = require('../controllers/groundController');

// Route to create a new ground
router.post('/create', groundController.createGround);

// Route to get all grounds
router.get('/', groundController.getAllGrounds);

// Route to get a specific ground by ID
router.get('/:id', groundController.getGroundById);

module.exports = router;