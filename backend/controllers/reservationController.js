const mongoose = require('mongoose');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');

// Helper function to update court slots availability
const updateCourtSlotsAvailability = async (courtId, date, timeSlotIds) => {
    const court = await Court.findOne({ courtId: courtId });

    if (!court) {
        throw new Error('Court not found');
    }

    // Find the specific date in court's timeSlots
    const dateSlot = court.timeSlots.find(slot => slot.date.toISOString().split('T')[0] === date);

    if (!dateSlot) {
        throw new Error('Date not available');
    }

    // Update availability for each selected time slot
    dateSlot.slots.forEach(slot => {
        if (timeSlotIds.includes(slot._id.toString())) {
            slot.available = false;
        }
    });

    await court.save();
};
// Function to generate a unique reservation ID
const generateUniqueId = () => {
    return 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};


exports.createReservation = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { groundId, courtId, date, timeSlots, userId } = req.body;

        if (!groundId || !courtId || !date || !timeSlots || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const trimmedGroundId = groundId.trim();
        const trimmedCourtId = courtId.trim();
        const reservationDate = new Date(date).toISOString().split('T')[0];

        // Find and validate the ground
        const ground = await Ground.findById(trimmedGroundId);
        if (!ground) {
            return res.status(404).json({ error: 'Ground not found' });
        }

        // Update court slots' availability
        await updateCourtSlotsAvailability(trimmedCourtId, reservationDate, timeSlots);

        const newReservation = new Reservation({
            groundId: trimmedGroundId,
            courtId: trimmedCourtId,
            date: new Date(date),
            timeSlots: timeSlots, // Store ObjectIds directly
            userId,
            reservationId: generateUniqueId()
        });

        await newReservation.save();

        res.status(201).json(newReservation);
    } catch (error) {
        console.error('Error creating reservation', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller to get reservations by ground and date
exports.getReservationsByGroundAndDate = async (req, res) => {
    try {
        const { groundId, date } = req.params;

        if (!groundId || !date) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const groundObjectId = new mongoose.Types.ObjectId(groundId);

        const courts = await Court.find({ groundId: groundObjectId });

        const reservations = await Reservation.find({
            groundId: groundObjectId,
            date: { $eq: new Date(date) },
            courtId: { $in: courts.map(court => court._id) }
        });

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
