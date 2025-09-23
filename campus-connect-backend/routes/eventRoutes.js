const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  rsvpToEvent,
  getPendingEvents,
  approveEvent,
  rejectEvent,
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public route to get all approved events
router.get('/', getAllEvents);

// Private route for creating an event
router.post('/', authMiddleware, createEvent);

// Private route for RSVPing to an event
router.post('/:id/rsvp', authMiddleware, rsvpToEvent);

// Admin routes
router.get('/pending', authMiddleware, adminMiddleware, getPendingEvents);
router.put('/:id/approve', authMiddleware, adminMiddleware, approveEvent);
router.delete('/:id/reject', authMiddleware, adminMiddleware, rejectEvent);
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;