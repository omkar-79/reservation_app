const Court = require('../models/Court');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, duration) => {
    let slots = [];
    let startDate = new Date(`1970-01-01T${startTime}:00Z`);
    let endDate = new Date(`1970-01-01T${endTime}:00Z`);

    while (startDate <= endDate) {
        // Convert the time to a more readable format, e.g., 'HH:MM'
        const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        slots.push(formattedTime);

        // Move to the next time slot
        startDate = new Date(startDate.getTime() + duration * 60000); // Add duration in minutes
    }

    return slots;
};


// Controller to create multiple courts and time slots
exports.createCourts = async (req, res) => {
    try {
        const { groundId, totalCourts, timeSlotDuration, timings } = req.body;

        if (!groundId || !totalCourts || !timeSlotDuration || !timings) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const timeSlots = generateTimeSlots(timings.from, timings.to, timeSlotDuration);

        const courtsData = [];
        // Create court IDs first
        const courtIds = [];
        for (let i = 0; i < totalCourts; i++) {
            courtIds.push(new mongoose.Types.ObjectId());
        }

        // For each court ID, create time slots for each day
        for (const courtId of courtIds) {
            for (let date = new Date(); date <= new Date('2024-08-31'); date.setDate(date.getDate() + 1)) {
                const courtData = {
                    groundId,
                    courtId,
                    timeSlots: [{ date: date.toISOString().split('T')[0], slots: timeSlots }],
                    reservedSlots: []
                };
                courtsData.push(courtData);
            }
        }

        // Insert courtsData in bulk
        await Court.insertMany(courtsData);
        res.status(201).json({ message: 'Courts and time slots created successfully' });
    } catch (error) {
        console.error('Error creating courts:', error);
        res.status(500).json({ error: error.message });
    }
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


// Controller to get time slots by court ID and date
exports.getTimeSlotsByCourtAndDate = async (req, res) => {
    try {
        const { courtId, date } = req.params;

        if (!courtId || !date) {
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

        const timeSlotsForDate = court.timeSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === targetDate.toDateString();
        });

        if (!timeSlotsForDate) {
            return res.status(404).json({ error: 'No time slots found for this date' });
        }

        const reservedSlotsForDate = court.reservedSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === targetDate.toDateString();
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
