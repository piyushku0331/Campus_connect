const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, campus, category } = req.body;

    // Check if user is admin to auto-approve
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isApproved = user.role === 'Admin';

    const newEvent = new Event({
      title,
      description,
      date,
      campus,
      category,
      organizer: req.user.id,
      isApproved,
    });
    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all approved events with filtering
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { campus, category, date } = req.query;
    const query = { isApproved: true };

    if (campus) query.campus = campus;
    if (category) query.category = category;
    if (date) query.date = { $gte: new Date(date) };

    const events = await Event.find(query).populate('organizer', 'name').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private
exports.rsvpToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    // Check if user has already RSVP'd
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'You have already RSVP\'d to this event' });
    }
    event.attendees.push(req.user.id);
    await event.save();
    res.json(event.attendees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all unapproved events
// @route   GET /api/events/pending
// @access  Admin
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate('organizer', 'name');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Approve an event
// @route   PUT /api/events/:id/approve
// @access  Admin
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json({ msg: 'Event approved successfully', event });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Reject (delete) an event
// @route   DELETE /api/events/:id/reject
// @access  Admin
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json({ msg: 'Event rejected and deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};