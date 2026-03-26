const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminController');

router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;