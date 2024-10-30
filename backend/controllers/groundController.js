const Ground = require('../models/Ground');
const mongoose = require('mongoose');
const courtController = require('../controllers/courtController');

// Create a ground and associated courts
exports.createGround = async (req, res) => {
  try {
      const { name, description, address, latitude, longitude, totalCourts, images, timings, icon, timeSlotDuration } = req.body;

      // Check for required fields
      if (!name || !address || !totalCourts || !timings || !icon || !timeSlotDuration) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create and save the ground
      const newGround = new Ground({
          name,
          description,
          address,
          latitude,
          longitude,
          totalCourts,
          images,
          timings,
          icon,
          timeSlotDuration,
          courtIds: []
      });

      await newGround.save();

      // Create courts for this ground
      const createdCourtsResponse = await courtController.createCourtsForGround({
          body: {
              totalCourts,
              timings,
              timeSlotDuration,
              groundId: newGround._id // Pass the ground ID
          }
      }, res);
      
      // Ensure courts are created
      if (!createdCourtsResponse) {
          return res.status(500).json({ error: 'Failed to create courts' });
      }

      const createdCourtIds = createdCourtsResponse.courts.map(court => court._id);

      // Update the ground document with created court IDs
      newGround.courtIds.push(...createdCourtIds);
      await newGround.save(); // Save updated ground with court IDs

      // Respond with ground and court details
      res.status(201).json({
          message: 'Ground and courts created successfully',
          ground: newGround,
          courtIds: createdCourtIds
      });
  } catch (error) {
      console.error('Error creating ground:', error);
      res.status(500).json({ error: 'Failed to create ground' });
  }
};


// Controller to get all grounds
exports.getAllGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find();
    res.status(200).json(grounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a ground by ID
exports.getGroundById = async (req, res) => {
  console.log('Fetching ground with ID:', req.params.id);
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    res.status(200).json(ground);
  } catch (error) {
    console.error('Error fetching ground by ID:', error);
    res.status(500).json({ error: error.message });
  }
};
