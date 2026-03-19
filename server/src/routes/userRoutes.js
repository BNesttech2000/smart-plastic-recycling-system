// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserContributions,
  getUserIncentives,
  getUserStatistics
} = require('../controllers/userController');
const {
  validateUserRegistration,
  validateUserLogin,
  validate
} = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateUserRegistration, validate, registerUser);
router.post('/login', validateUserLogin, validate, loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/contributions', protect, getUserContributions);
router.get('/incentives', protect, getUserIncentives);
router.get('/statistics', protect, getUserStatistics);

module.exports = router;