const Court = require('../models/Court');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');


// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, duration) => {
    let slots = [];
    let currentTime = new Date(`1970-01-01T${startTime}:00Z`);
    let endTimeDate = new Date(`1970-01-01T${endTime}:00Z`);

    console.log("Start time:", currentTime);
    console.log("End time:", endTimeDate);
    console.log("Duration (minutes):", duration);

    while (currentTime <= endTimeDate) {
        slots.push(currentTime.toISOString());
        currentTime = new Date(currentTime.getTime() + duration * 60000); // Add duration in minutes
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
        console.log("Generated time slots:", timeSlots);

        const courtsData = [];
        for (let i = 0; i < totalCourts; i++) {
            for (let date = new Date(); date <= new Date('2024-08-15'); date.setDate(date.getDate() + 1)) {
                const courtData = {
                    groundId,
                    courtId: new mongoose.Types.ObjectId(),
                    timeSlots: [{ date: date.toISOString().split('T')[0], slots: timeSlots }],
                    reservedSlots: []
                };
                console.log("Prepared court data:", courtData);
                courtsData.push(courtData);
            }
        }

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

        const courts = await Court.find({ groundId });

        if (courts.length === 0) {
            return res.status(404).json({ error: 'No courts found for this ground' });
        }

        res.json(courts);
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

        const court = await Court.findOne({ courtId, 'timeSlots.date': targetDate });
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

        // Get reserved slots for the specific date
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

        // Find and update the court
        const court = await Court.findOne({ courtId, 'timeSlots.date': targetDate });
        if (!court) {
            return res.status(404).json({ error: 'Court or time slots not found' });
        }

        // Update reservedSlots for the court
        let reservedSlotsForDate = court.reservedSlots.find(slot => {
            const slotDate = new Date(slot.date);
            return slotDate.toDateString() === targetDate.toDateString();
        });

        if (!reservedSlotsForDate) {
            reservedSlotsForDate = { date: targetDate, reserved: [] };
            court.reservedSlots.push(reservedSlotsForDate);
        }

        // Check if any of the time slots are already reserved
        for (const slot of timeSlots) {
            if (reservedSlotsForDate.reserved.includes(slot)) {
                return res.status(409).json({ error: `Time slot ${slot} already reserved` });
            }
        }

        // Add the reserved time slots
        reservedSlotsForDate.reserved.push(...timeSlots);
        await court.save();

        // Create a reservation record
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
