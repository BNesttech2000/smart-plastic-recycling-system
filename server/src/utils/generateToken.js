// server/src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;