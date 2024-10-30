const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: String,
  latitude: Number,
  longitude: Number,
  totalCourts: Number,
  images: [String],
  timings: {
    from: String,
    to: String
  },
  icon: {
    type: String,// Example icons, add more as needed
    required: true
  },
  timeSlotDuration: Number,
  courtIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Court' }] // Add this line
});

module.exports = mongoose.model('Ground', groundSchema);
