// reservationModel.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',
        required: true
    },
    courtId: {
        type: String,
        required: true
    },
    courtName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlotIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court.timeSlots.slots', // Reference to slots in the court model
        required: true
    }],
    timeSlots: [{
        start: { type: String, required: true },
        end: { type: String, required: true }
    }],
    userId: {
        type: String,
        required: true
    },
    reservationId: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Reservation', reservationSchema);
