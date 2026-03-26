const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Public Controllers
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isActive: true, date: { $gte: new Date() } }).sort({ date: 1 });
  res.json({ success: true, data: events });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.json({ success: true, data: event });
});

// User Controllers
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  if (event.registered >= event.capacity) {
    res.status(400);
    throw new Error('Event is full');
  }
  const existingRegistration = await EventRegistration.findOne({ event: event._id, user: req.user._id });
  if (existingRegistration) {
    res.status(400);
    throw new Error('Already registered for this event');
  }
  await EventRegistration.create({ event: event._id, user: req.user._id });
  event.registered += 1;
  await event.save();
  res.json({ success: true, message: 'Successfully registered for event' });
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findOne({ event: req.params.id, user: req.user._id });
  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }
  await registration.deleteOne();
  const event = await Event.findById(req.params.id);
  event.registered -= 1;
  await event.save();
  res.json({ success: true, message: 'Registration cancelled successfully' });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const registrations = await EventRegistration.find({ user: req.user._id })
    .populate('event')
    .sort({ registeredAt: -1 });
  res.json({ success: true, data: registrations });
});

// Admin Controllers
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: events });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  Object.assign(event, req.body);
  await event.save();
  res.json({ success: true, data: event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  await event.deleteOne();
  res.json({ success: true, message: 'Event deleted successfully' });
});

module.exports = {
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};