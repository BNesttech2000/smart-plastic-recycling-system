const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminController');
const { getAdminDashboardStats } = require('../controllers/contributionController');

router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/dashboard-stats', protect, admin, getAdminDashboardStats);

module.exports = router;