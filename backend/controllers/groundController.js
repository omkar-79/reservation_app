const Ground = require('../models/Ground');
const mongoose = require('mongoose');
const courtController = require('../controllers/courtController');

exports.createGround = async (req, res) => {
  try {
    console.log(req.body); 
    const { name, description, address, latitude, longitude, totalCourts, images, timings, icon, timeSlotDuration } = req.body;

    // Basic validation
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
      timeSlotDuration
    });

    await newGround.save();

    // Prepare data for creating courts
    const courtData = {
      groundId: newGround._id,
      totalCourts: newGround.totalCourts,
      timeSlotDuration: newGround.timeSlotDuration,
      timings: newGround.timings
    };

    // Call createCourts method from courtController
    courtController.createCourts({ body: courtData }, {
      status: (statusCode) => ({
        json: (data) => {
          // Send the response from createCourts method
          res.status(statusCode).json(data);
        }
      })
    });

  } catch (error) {
    console.error('Error creating ground:', error);
    res.status(400).json({ error: error.message });
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
