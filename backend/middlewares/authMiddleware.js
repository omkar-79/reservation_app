const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ea573ec26b178b70550e9109d3fdc33f59c0923ca1a4a50f98a1e223f78cb5d4c676f1ff415ba5895d4d46fc9885efcf90a100401d89f8f568066a839ac7b0f7';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from header

  if (token == null) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // Attach user information to request
    next();
  });
};

module.exports = authenticateToken;
