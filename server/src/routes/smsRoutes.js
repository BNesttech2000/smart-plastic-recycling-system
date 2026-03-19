// server/src/routes/smsRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  sendContributionNotification,
  sendBulkNotifications,
  getSMSBalance
} = require('../controllers/smsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for verification
router.post('/verify', sendVerificationCode);

// Protected routes
router.use(protect);

router.post('/contribution-notification', admin, sendContributionNotification);
router.post('/bulk', admin, sendBulkNotifications);
router.get