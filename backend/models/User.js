const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String }, // For Google sign-in option
  role: { 
    type: String, 
    enum: ['Reservee', 'Facility Owner'], // Allowed roles
  },
  createdAt: { type: Date, default: Date.now }, // Optional: track registration time
  tokens: [{ token: { type: String, required: true } }], // Optional: store multiple JWT tokens
  passwordResetToken: { type: String }, // Optional: for password reset
  passwordResetExpires: { type: Date } // Optional: for password reset expiration
});

module.exports = mongoose.model('User', userSchema);
