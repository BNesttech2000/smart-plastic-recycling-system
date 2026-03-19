// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Administrator = require('../models/Administrator');
const { asyncHandler } = require('./errorMiddleware');

// Protect routes - verify user token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized - user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized - token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - no token');
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's an admin
      req.admin = await Administrator.findById(decoded.id).select('-password');

      if (!req.admin) {
        res.status(401);
        throw new Error('Not authorized as admin');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized as admin');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - no token');
  }
});

// Optional auth - doesn't require token but attaches user if present
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Silently fail - user just won't be attached
    }
  }
  next();
});

module.exports = { protect, admin, optionalAuth };