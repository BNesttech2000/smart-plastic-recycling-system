// server/src/routes/incentiveRoutes.js
const express = require('express');
const router = express.Router();
const {
  getIncentives,
  getIncentiveById,
  redeemIncentive,
  getIncentiveStatistics
} = require('../controllers/incentiveController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.put('/:id/redeem', redeemIncentive);

// Admin routes
router.get('/', admin, getIncentives);
router.get('/statistics', admin, getIncentiveStatistics);
router.get('/:id', getIncentiveById);

module.exports = router;