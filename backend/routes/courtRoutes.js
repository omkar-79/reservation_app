const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');

// Define routes with appropriate handlers
router.get('/courts/by-ground/:groundId', courtController.getCourtsByGroundId);
router.get('/courts/:courtId/time-slots/:date', courtController.getTimeSlotsByCourtAndDate);
router.post('/courts/reserve', courtController.reserveTimeSlot); // Route for reserving a time slot
router.post('/courts/create', courtController.createCourts); // Route for creating courts


module.exports = router;