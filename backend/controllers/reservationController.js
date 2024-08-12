const mongoose = require('mongoose');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');

// Helper functions
const timeSlotToMinutes = (timeSlot) => {
    console.log('Time Slot Received:', timeSlot); // Log the time slot
    
    if (typeof timeSlot !== 'string') {
        throw new TypeError('Time slot must be a string');
    }

    const [time, period] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
};


const isOverlap = (slots1, reservedSlots) => {
    console.log('Requested Slots:', slots1);
    console.log('Reserved Slots:', reservedSlots);

    // Flatten the reservedSlots to a single array of reserved time slots
    const allReservedSlots = reservedSlots
        .filter(reservedSlot => {
            if (!reservedSlot.date) {
                console.warn('Reserved slot missing date:', reservedSlot);
                return false; // Skip entries without a date
            }
            // Convert the date to a string format for comparison
            const reservedDate = new Date(reservedSlot.date).toISOString().split('T')[0];
            return reservedDate === '2024-08-13'; // Use the date from the request
        })
        .flatMap(reservedSlot => reservedSlot.reserved || []); // Ensure `reserved` is an array

    console.log('Flattened Reserved Slots:', allReservedSlots);

    // Check for overlaps
    for (let slot1 of slots1) {
        if (typeof slot1 !== 'string') {
            throw new TypeError('Time slot must be a string');
        }
        if (allReservedSlots.includes(slot1)) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
};






const generateUniqueId = () => {
    return 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Controller to create a new reservation
exports.createReservation = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the incoming request
        const { groundId, courtId, date, timeSlots, userId } = req.body;

        if (!groundId || !courtId || !date || !timeSlots || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const groundObjectId = new mongoose.Types.ObjectId(groundId);
        const courtObjectId = new mongoose.Types.ObjectId(courtId);

        console.log('Ground ObjectId:', groundObjectId);
        console.log('Court ObjectId:', courtObjectId);

        const court = await Court.findOne({
            groundId: groundObjectId,
            courtId: courtObjectId,
            'timeSlots.date': new Date(date).toISOString().split('T')[0] // Adjusted query for date matching
        });

        if (!court) {
            console.log('Court not found');
            return res.status(404).json({ error: 'Court not found' });
        }

        const reservedSlots = court.reservedSlots || [];

        if (isOverlap(timeSlots, reservedSlots)) {
            console.log('Overlap detected');
            return res.status(400).json({ error: 'The requested time slots overlap with existing reservations for this court.' });
        }

        const newReservation = new Reservation({
            groundId: groundObjectId,
            courtId: courtObjectId,
            date: new Date(date),
            timeSlots,
            userId,
            reservationId: generateUniqueId()
        });

        await newReservation.save();

        // Initialize reservedSlots array if not present
        if (!court.reservedSlots) {
            court.reservedSlots = [];
        }

        court.reservedSlots.push({
            date: new Date(date),
            reserved: timeSlots
        });
        await court.save();

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

        const courts = await Court.find({
            groundId: groundObjectId,
            date: new Date(date)
        });

        const reservations = courts.flatMap(court => court.reservations);

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
