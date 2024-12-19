const mongoose = require('mongoose');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');
const User = require('../models/User');

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

// In reservationController.js

// Controller to create a reservation
// In reservationController.js


exports.cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        
        // 1. Find the reservation
        const reservation = await Reservation.findOne({ reservationId: reservationId });
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        
        // 2. Update the availability of associated time slots in the Court model
        const court = await Court.findOne({ courtId: reservation.courtId });
        
        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }
        
        const reservationDate = new Date(reservation.date);
        const dateString = reservationDate.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

        // Find the correct date in the timeSlots array
        const timeSlotIndex = court.timeSlots.findIndex(ts => 
            ts.date.toISOString().split('T')[0] === dateString
        );

        if (timeSlotIndex === -1) {
            return res.status(404).json({ message: 'Time slots for this date not found' });
        }

        // Update availability for each reserved time slot
        reservation.timeSlots.forEach(reservedSlot => {
            const slotIndex = court.timeSlots[timeSlotIndex].slots.findIndex(slot => 
                slot.start === reservedSlot.start && slot.end === reservedSlot.end
            );
            if (slotIndex !== -1) {
                court.timeSlots[timeSlotIndex].slots[slotIndex].available = true;
            }
        });

        // Remove the reservation from reservedSlots
        const reservedSlotIndex = court.reservedSlots.findIndex(rs => 
            rs.date.toISOString().split('T')[0] === dateString
        );
        if (reservedSlotIndex !== -1) {
            court.reservedSlots[reservedSlotIndex].reserved = court.reservedSlots[reservedSlotIndex].reserved.filter(
                slot => !reservation.timeSlots.some(rs => `${rs.start}-${rs.end}` === slot)
            );
        }

        // Save the updated court using findOneAndUpdate to avoid validation issues
        await Court.findOneAndUpdate(
            { _id: court._id },
            { 
                $set: {
                    timeSlots: court.timeSlots,
                    reservedSlots: court.reservedSlots
                }
            },
            { new: true, runValidators: false }
        );
        
        // 3. Delete the reservation
        await Reservation.findByIdAndDelete(reservation._id);
        
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { groundId, courtId, date, timeSlotIds, timeSlots, userId, courtName } = req.body;

        if (!groundId || !courtId || !date || !timeSlotIds || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const trimmedGroundId = groundId.trim();
        const trimmedCourtId = courtId.trim();
        const reservationDate = new Date(date).toISOString().split('T')[0];

        // Find and validate the ground
        const ground = await Ground.findById(trimmedGroundId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'Reservee') {
            return res.status(403).json({ message: 'Only users with the Reservee role can make a reservation.' });
        }

        if (!ground) {
            return res.status(404).json({ error: 'Ground not found' });
        }

        

        // Update court slots' availability
        await updateCourtSlotsAvailability(trimmedCourtId, reservationDate, timeSlotIds);

        const newReservation = new Reservation({
            groundId: trimmedGroundId,
            courtId: trimmedCourtId,
            courtName,
            date: new Date(date),
            timeSlotIds: timeSlotIds, // Store ObjectIds directly
            timeSlots,
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

// Controller to get all reservations
exports.getAllReservations = async (req, res) => {
    try {
        // Fetch all reservations from the database
        const reservations = await Reservation.find();

        // Check if reservations exist
        if (reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        // Return the list of reservations
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
