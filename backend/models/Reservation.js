const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    groundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ground',  // Reference to the Ground model
        required: true
    },
    courtId: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming courtId is a number and is directly stored in Ground
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlots: [String],  // Array of selected time slots
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
