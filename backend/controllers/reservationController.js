const mongoose = require('mongoose');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');

// Helper functions
const timeSlotToMinutes = (timeSlot) => {
    const [start, end] = timeSlot.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return {
        start: startHour * 60 + startMinute,
        end: endHour * 60 + endMinute
    };
};

const isOverlap = (slots1, slots2) => {
    for (let slot1 of slots1) {
        const { start: start1, end: end1 } = timeSlotToMinutes(slot1);
        for (let slot2 of slots2) {
            const { start: start2, end: end2 } = timeSlotToMinutes(slot2);
            if (start1 < end2 && end1 > start2) {
                return true;
            }
        }
    }
    return false;
};

const generateUniqueId = () => {
    return 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Controller to create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { groundId, courtId, date, timeSlots, userId } = req.body;

        if (!groundId || !courtId || !date || !timeSlots || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const groundObjectId = new mongoose.Types.ObjectId(groundId);
        const courtObjectId = new mongoose.Types.ObjectId(courtId);

        const court = await Court.findOne({
            groundId: groundObjectId,
            courtId: courtObjectId,
            date: new Date(date)
        });

        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }

        if (isOverlap(timeSlots, court.timeSlots)) {
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

        court.reservations.push({
            userId,
            reservationId: newReservation.reservationId,
            timeSlots
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
