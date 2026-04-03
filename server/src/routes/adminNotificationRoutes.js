const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

router.use(protect);
router.use(admin);

// Get all notifications (admin view)
router.get('/', asyncHandler(async (req, res) => {
  const notifications = await Notification.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(notifications);
}));

// Send notification to users
router.post('/send', asyncHandler(async (req, res) => {
  const { title, message, type, userId } = req.body;
  
  let users = [];
  if (userId === 'all') {
    users = await User.find({ isActive: true });
  } else if (userId === 'active') {
    users = await User.find({ isActive: true });
  } else if (userId === 'users') {
    users = await User.find({ role: 'user', isActive: true });
  } else {
    const user = await User.findById(userId);
    if (user) users = [user];
  }
  
  const notifications = await Notification.insertMany(
    users.map(user => ({
      user: user._id,
      title,
      message,
      type: type || 'info',
      createdAt: new Date()
    }))
  );
  
  res.status(201).json({ success: true, count: notifications.length });
}));

// Delete notification
router.delete('/:id', asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}));

module.exports = router;