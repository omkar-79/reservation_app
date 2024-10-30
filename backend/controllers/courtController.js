const Court = require('../models/Court');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');



// Function to fetch all courts
exports.getAllCourts = async (req, res) => {
    try {
        // Fetch all court documents
        const courts = await Court.find().populate('groundId'); // Optional: Populate groundId if needed

        res.json(courts);
    } catch (error) {
        console.error('Error fetching courts', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to generate time slots for a given date
function generateTimeSlots(startTime, endTime, timeSlotDuration) {
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    while (start < end) {
        const nextStart = new Date(start);
        const nextEnd = new Date(start.setMinutes(start.getMinutes() + timeSlotDuration));
        
        slots.push({
            start: nextStart.toTimeString().split(' ')[0], // Format as HH:MM:SS
            end: nextEnd.toTimeString().split(' ')[0],
            available: true // Initially available
        });
    }
    return slots;
}

// Function to create courts for a ground
exports.createCourtsForGround = async (req, res) => {
    const { totalCourts, timings, timeSlotDuration } = req.body;

    const createdCourts = [];
    const { from, to } = timings;

    for (let i = 1; i <= totalCourts; i++) {
        const courtId = `Court-${i}`; // Unique identifier for each court
        const timeSlots = generateTimeSlots(from, to, timeSlotDuration);
        
        const newCourt = new Court({
            groundId: req.body.groundId, // Assumes groundId is in the request body
            courtId,
            timeSlots: [{ date: new Date(), slots: timeSlots }], // Store slots for today
            reservedSlots: [] // Initially empty
        });

        await newCourt.save();
        createdCourts.push(newCourt);
    }

    return { courts: createdCourts }; // Return created courts for further processing
};



// Controller to get courts by ground ID

exports.getCourtsByGroundId = async (req, res) => {
    try {
        const { groundId } = req.params;

        if (!groundId) {
            return res.status(400).json({ error: 'Ground ID is required' });
        }

        console.log('Received groundId:', groundId); // Debugging line

        // Ensure groundId is a valid ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(groundId);
        } catch (error) {
            console.error('Error converting groundId to ObjectId:', error); // Debugging line
            return res.status(400).json({ error: 'Invalid Ground ID format' });
        }

        // Aggregation pipeline to get unique courtIds
        const uniqueCourts = await Court.aggregate([
            { $match: { groundId: objectId } },
            { $group: { _id: "$courtId" } }
        ]);

        if (uniqueCourts.length === 0) {
            return res.status(404).json({ error: 'No courts found for this ground' });
        }

        // Map the result to return only courtIds
        const courtIds = uniqueCourts.map(court => court._id);

        res.json(courtIds);
    } catch (error) {
        console.error('Error fetching courts by ground ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTimeSlotsByCourtAndDate = async (req, res) => {
    try {
        const { courtId, date } = req.params;

        if (!courtId || !date) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Parse the incoming date string to a Date object
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Find the court by the 'courtId' field
        const court = await Court.findOne({ courtId: courtId });
        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }

        // Retrieve time slots for the target date
        const timeSlotsForDate = court.timeSlots.find(slot => {
            return new Date(slot.date).toDateString() === targetDate.toDateString();
        });

        if (!timeSlotsForDate) {
            return res.status(404).json({ error: 'No time slots found for this date' });
        }

        // Retrieve reserved slots for the target date
        const reservedSlotsForDate = court.reservedSlots.find(slot => {
            return new Date(slot.date).toDateString() === targetDate.toDateString();
        }) || { reserved: [] };

        res.json({
            timeSlots: timeSlotsForDate.slots,
            reservedSlots: reservedSlotsForDate.reserved
        });
    } catch (error) {
        console.error('Error fetching time slots', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Controller to reserve a time slot for a court
exports.reserveTimeSlot = async (req, res) => {
    try {
        const { courtId, date, timeSlots, userId } = req.body;

        if (!courtId || !date || !timeSlots || !userId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const court = await Court.findOne({ courtId, 'timeSlots.date': targetDate.toISOString().split('T')[0] });
        if (!court) {
            return res.status(404).json({ error: 'Court or time slots not found' });
        }

        let reservedSlotsForDate = court.reservedSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === targetDate.toDateString();
        });

        if (!reservedSlotsForDate) {
            reservedSlotsForDate = { date: targetDate.toISOString().split('T')[0], reserved: [] };
            court.reservedSlots.push(reservedSlotsForDate);
        }

        for (const slot of timeSlots) {
            if (reservedSlotsForDate.reserved.includes(slot)) {
                return res.status(409).json({ error: `Time slot ${slot} already reserved` });
            }
        }

        reservedSlotsForDate.reserved.push(...timeSlots);
        await court.save();

        const reservation = new Reservation({
            courtId,
            date: targetDate,
            timeSlots,
            userId
        });

        await reservation.save();

        res.json({ message: 'Time slot reserved successfully' });
    } catch (error) {
        console.error('Error reserving time slot', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
