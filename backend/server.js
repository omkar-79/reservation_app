const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const groundRoutes = require('./routes/groundRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const courtRoutes = require('./routes/courtRoutes');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;



// Increase the limit to 50mb (or as per your requirement)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Update CORS configuration
app.use(cors({
  origin: [
    'https://192.241.140.48:3001',
    'https://192.241.140.48',
    'https://mykerchief.live',
    'http://localhost:3001'  // Keep HTTP for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use('/users', userRoutes);
app.use('/api/', groundRoutes);
app.use('/api/', reservationRoutes);
app.use('/api/', courtRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Since we're using Nginx for SSL, don't create an HTTPS server here. 
// We just need the HTTP server listening on port 3000.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
