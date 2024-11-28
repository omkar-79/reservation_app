const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { decodeJwt } = require('@react-oauth/google');


const JWT_SECRET = process.env.JWT_SECRET || 'ea573ec26b178b70550e9109d3fdc33f59c0923ca1a4a50f98a1e223f78cb5d4c676f1ff415ba5895d4d46fc9885efcf90a100401d89f8f568066a839ac7b0f7';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';




// Controller to create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!['Reservee', 'Facility Owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to log in a user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to handle Google Sign-In
exports.googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body; // Obtain the Google credential from the frontend

    // Decode the Google credential
    const payload = decodeJwt(credential);

    const { sub: googleId, email, name: username } = payload;

    // Check if a user already exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if one doesn't exist
      user = new User({
        username,
        email,
        googleId,
      });

      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};