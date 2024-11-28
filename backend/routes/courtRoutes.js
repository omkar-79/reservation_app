const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');

// Define routes with appropriate handlers
router.get('/courts/by-ground/:groundId', courtController.getCourtsByGroundId);
router.get('/courts/:courtId/time-slots/:date', courtController.getTimeSlotsByCourtAndDate);
router.post('/courts/reserve', courtController.reserveTimeSlot); // Route for reserving a time slot
router.post('/courts/create', courtController.createCourtsForGround); // Route for creating courts
router.get('/courts', courtController.getAllCourts);
router.post('/courts/name', courtController.getCourtNameByCourtId); // Route for updating courts

module.exports = router;
