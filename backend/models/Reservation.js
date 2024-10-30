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
    date: {
        type: Date,
        required: true
    },
    timeSlots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court.timeSlots.slots', // Reference to slots in the court model
        required: true
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
});

module.exports = mongoose.model('Reservation', reservationSchema);
