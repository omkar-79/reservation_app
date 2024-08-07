const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

console.log('JWT Secret Key:', generateSecretKey());
ea573ec26b178b70550e9109d3fdc33f59c0923ca1a4a50f98a1e223f78cb5d4c676f1ff415ba5895d4d46fc9885efcf90a100401d89f8f568066a839ac7b0f7