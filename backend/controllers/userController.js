const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



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
      { userId: user._id, username: user.username, role: user.role }, // Attach user details to the token
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

// Controller to get the user profile with reservations
exports.getReserveeProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // userId is attached to req.user from the authenticateToken middleware
    console.log('Received userId from middleware:', userId);

    // Fetch user details
    const user = await User.findById(userId);
    console.log('Fetched user details:', user);

    if (!user) {
      console.log('User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is a Reservee
    if (user.role !== 'Reservee') {
      console.log('Access forbidden: User role is not Reservee:', user.role);
      return res.status(403).json({ error: 'Access forbidden: only Reservee can access this profile' });
    }

    // Fetch reservations for the user
    console.log('Fetching reservations for userId:', userId);
    const reservations = await Reservation.find({ userId: userId })
      .populate({
        path: 'groundId',
        select: 'name address' // Fetch only the 'name' field from Ground
      })
      .populate({
        path: 'courtId', // Adjust this to reference Court schema directly
        select: 'courtName', // Ensure you're fetching valid court data
      });

    console.log('Fetched reservations:', reservations);

    // Process timeSlots field (handle the nested timeSlots field directly)
    const processedReservations = reservations.map(reservation => ({
      reservationId: reservation.reservationId,
      groundName: reservation.groundId?.name || 'Unknown Ground',
      groundAddress: reservation.groundId?.address || 'Unknown Address',
      courtName: reservation.courtName,
      timeSlots: reservation.timeSlots.map(slot => {
        // Ensure we are processing the 'start' and 'end' times correctly
        if (slot.start && slot.end) {
          return {
            start: slot.start,
            end: slot.end
          };
        }
        return { start: 'Unknown Start', end: 'Unknown End' }; // Handle invalid or missing timeSlots
      }),
      date: reservation.date,
    }));

    const response = {
      username: user.username,
      email: user.email,
      reservations: processedReservations,
    };

    console.log('Response data prepared:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getReserveeProfile:', error);
    res.status(500).json({ error: error.message });
  }
};
