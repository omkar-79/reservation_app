const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const groundRoutes = require('./routes/groundRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const courtRoutes = require('./routes/courtRoutes');
const cors = require('cors');
const http = require('http'); 

const app = express();
const PORT = process.env.PORT || 3000;



// Increase the limit to 50mb (or as per your requirement)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Update CORS configuration
app.use(cors({
  origin: [
    'https://mykerchief.live',
    'https://www.mykerchief.live',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS for all origins
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use('/api/', userRoutes);
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


// Create HTTP server instead of HTTPS
http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on port ${PORT}`);
});