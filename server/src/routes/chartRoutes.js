// server/src/routes/chartRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMonthlyTrends,
  getCategoryComparison,
  getUserRanking,
  getDailyActivity
} = require('../controllers/chartController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/monthly-trends', getMonthlyTrends);
router.get('/category-comparison', getCategoryComparison);
router.get('/user-ranking', getUserRanking);
router.get('/daily-activity', getDailyActivity);

module.exports = router;