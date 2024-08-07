const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
        required: true
    },
    courtId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timeSlots: [
        {
            date: {
                type: Date,
                required: true
            },
            slots: [String] // Array of available time slots as strings
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
