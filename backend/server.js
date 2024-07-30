const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/reservation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Simple route
app.get('/', (req, res) => {
  res.send('Hello, Omkar!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
