// server/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getDashboardStats
} = require('../controllers/adminController');
const { admin } = require('../middleware/authMiddleware');

// Public route
router.post('/login', adminLogin);

// All routes below require admin authentication
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Admin management (super admin only)
router.post('/create', createAdmin);

module.exports = router;