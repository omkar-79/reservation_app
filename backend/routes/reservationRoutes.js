// reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController'); // Check this path

// Ensure reservationController has createReservation and getReservationsByGroundAndDate methods
console.log(reservationController); // Add this line to debug

// Route to create a reservation
router.post('/', reservationController.createReservation);

// Route to get reservations by ground and date
router.get('/by-ground/:groundId/date/:date', reservationController.getReservationsByGroundAndDate);

module.exports = router;