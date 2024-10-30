// courtmodel.js
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
        required: true
    },
    courtId: {
        type: String,
        required: true,
        unique: true // Ensures that each court has a unique identifier
    },
    timeSlots: [
        {
            date: {
                type: Date,
                required: true
            },
            slots: [
                {
                    start: String, // Start time
                    end: String,   // End time
                    available: { type: Boolean, default: true } // Is slot available?
                }
            ]
        }
    ],
    reservedSlots: [
        {
            date: {
                type: Date,
                required: true
            },
            reserved: [String] // Array of reserved time slots for this date
        }
    ]
});

module.exports = mongoose.model('Court', courtSchema);
