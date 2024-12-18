const Court = require('../models/Court');
const Ground = require('../models/Ground');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

// Function to fetch all courts
exports.getAllCourts = async (req, res) => {
    try {
        // Fetch all court documents
        const courts = await Court.find(); // Optional: Populate groundId if needed

        res.json(courts);
    } catch (error) {
        console.error('Error fetching courts', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to generate time slots for a given date range
function generateTimeSlots(startTime, endTime, timeSlotDuration, startDate, endDate) {
    const slots = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const daySlots = [];
        const start = new Date(currentDate);
        start.setHours(startTime.split(':')[0], startTime.split(':')[1], 0);
        const end = new Date(currentDate);
        end.setHours(endTime.split(':')[0], endTime.split(':')[1], 0);

        while (start < end) {
            const nextStart = new Date(start);
            const nextEnd = new Date(start.setMinutes(start.getMinutes() + timeSlotDuration));
            
            daySlots.push({
                start: nextStart.toTimeString().split(' ')[0], // Format as HH:MM:SS
                end: nextEnd.toTimeString().split(' ')[0],
                available: true // Initially available
            });
        }

        slots.push({
            date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            slots: daySlots
        });

        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }
    return slots;
}

// Function to create courts for a ground
exports.createCourtsForGround = async (req) => {
    const { totalCourts, timings, timeSlotDuration, dateRange, groundId } = req.body;

    if (!groundId) {
        throw new Error('Ground ID is required');
    }

    const createdCourts = [];
    const { from: startTime, to: endTime } = timings;
    
    let startDate, endDate;
    if (dateRange && dateRange.from && dateRange.to) {
        startDate = new Date(dateRange.from);
        endDate = new Date(dateRange.to);
    } else {
        // If dateRange is not provided, use today's date for both start and end
        startDate = new Date();
        endDate = new Date();
    }

    try {
        for (let i = 0; i < totalCourts; i++) {
            const courtId = `Court-${uuidv4()}`; // Unique identifier for each court
            const courtName = `Court-${i + 1}`;
            const timeSlots = generateTimeSlots(startTime, endTime, timeSlotDuration, startDate, endDate);
            
            const newCourt = new Court({
                groundId,
                courtId,
                courtName,
                timeSlots,
                reservedSlots: [] // Initially empty
            });

            await newCourt.save();
            createdCourts.push(newCourt);
        }

        return { courts: createdCourts };
    } catch (error) {
        console.error('Error creating courts:', error);
        throw error;
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

exports.getTimeSlotsByCourtAndDate = async (req, res) => {
    try {
        const { courtId, date } = req.params;
        console.log('Received courtId and date:', courtId, date); // Debugging line
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

// Function to fetch court name by courtId
exports.getCourtNameByCourtId = async (req, res) => {
    try {
        const { courtId } = req.body; // Get the courtId from the URL params

        if (!courtId) {
            return res.status(400).json({ error: 'Court ID is required' });
        }

        // Find the court by its courtId
        const court = await Court.findOne({ courtId: courtId });

        if (!court) {
            return res.status(404).json({ error: 'Court not found' });
        }

        // Return the courtName
        res.json({ courtName: court.courtName });
    } catch (error) {
        console.error('Error fetching court name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
