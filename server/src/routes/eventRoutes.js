const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.use(protect);
router.get('/my-events', getMyEvents);
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', cancelRegistration);

module.exports = router;