const Event = require('../models/Event');
const EventAttendee = require('../models/EventAttendee');
const logger = require('../utils/logger');
const { awardPoints, checkAchievements } = require('./gamificationController');

const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, upcoming = false } = req.query;
    const offset = (page - 1) * limit;
    let query = {};
    if (upcoming === 'true') {
      query.start_date = { $gte: new Date() };
    }
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer_id', 'id full_name avatar_url')
      .sort({ start_date: 1 })
      .skip(offset)
      .limit(parseInt(limit, 10));
    res.json({
      events,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizer_id', 'id full_name avatar_url');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const attendees = await EventAttendee.find({ event_id: id }).populate('user_id', 'id full_name avatar_url');
    const eventWithAttendees = {
      ...event.toObject(),
      attendees: attendees.map(att => ({
        user: att.user_id,
        status: att.status
      }))
    };
    res.json(eventWithAttendees);
  } catch (error) {
    logger.error('Error fetching event by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, location, start_date, end_date, max_attendees, tags, campus, category } = req.body;

    if (!title || !description || !location || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required event fields.' });
    }

    const event = new Event({
      title,
      description,
      location,
      start_date,
      end_date,
      organizer_id: userId,
      max_attendees,
      tags,
      campus,
      category
    });
    await event.save();
    await awardPoints(userId, 50, 'created_event', event._id);
    await checkAchievements(userId);
    res.status(201).json(event);
  } catch (error) {
    logger.error('Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = { ...req.body, updated_at: new Date() };
    // Prevent organizer_id from being changed
    delete updateData.organizer_id;

    const event = await Event.findOneAndUpdate(
      { _id: id, organizer_id: userId },
      updateData,
      { new: true }
    );
    if (!event) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }
    res.json(event);
  } catch (error) {
    logger.error('Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const event = await Event.findOneAndDelete({ _id: id, organizer_id: userId });
    if (!event) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    if (!['attending', 'not_attending', 'interested'].includes(status)) {
      return res.status(400).json({ error: 'Invalid RSVP status.' });
    }

    const rsvp = await EventAttendee.findOneAndUpdate(
      { event_id: id, user_id: userId },
      { status, rsvp_date: new Date() },
      { upsert: true, new: true }
    );

    if (status === 'attending') {
      await awardPoints(userId, 10, 'rsvp_event', id);
    }

    res.json(rsvp);
  } catch (error) {
    logger.error('Error RSVPing to event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendees = await EventAttendee.find({ user_id: userId }).populate('event_id');
    const events = attendees.map(att => ({
      ...att.event_id.toObject(),
      status: att.status
    })).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    res.json(events);
  } catch (error) {
    logger.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  getUserEvents
};
