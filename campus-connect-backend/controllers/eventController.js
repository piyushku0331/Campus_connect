const Event = require('../models/Event');
const User = require('../models/User');




exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, campus, category } = req.body;

    
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




exports.rsvpToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
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




exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate('organizer', 'name');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




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