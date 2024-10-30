const express = require('express');
const router = express.Router();
const groundController = require('../controllers/groundController');

// Route to create a new ground
router.post('/grounds/create', groundController.createGround);

// Route to get all grounds
router.get('/grounds', groundController.getAllGrounds);

// Route to get a specific ground by ID
router.get('/grounds/:id', groundController.getGroundById);

module.exports = router;
