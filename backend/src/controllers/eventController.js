const { supabase } = require('../config');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, upcoming = false } = req.query;
    const offset = (page - 1) * limit;
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:users(id, full_name, avatar_url)
      `)
      .order('start_date', { ascending: true });
    let countQuery = supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    if (upcoming === 'true') {
      query = query.gte('start_date', new Date().toISOString());
      countQuery = countQuery.gte('start_date', new Date().toISOString());
    }
    const { count } = await countQuery;
    const { data: events, error } = await query
      .range(offset, offset + limit - 1);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users(id, full_name, avatar_url),
        attendees:event_attendees(
          user:users(id, full_name, avatar_url),
          status
        )
      `)
      .eq('id', id)
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch event' });
    }
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, location, start_date, end_date, max_attendees, tags } = req.body;
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        location,
        start_date,
        end_date,
        organizer_id: userId,
        max_attendees,
        tags
      })
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to create event' });
    }
    await awardPoints(userId, 50, 'created_event', event.id);
    await checkAchievements(userId);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, location, start_date, end_date, max_attendees, tags } = req.body;
    const { data: existingEvent } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();
    if (!existingEvent || existingEvent.organizer_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }
    const { data: event, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        location,
        start_date,
        end_date,
        max_attendees,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to update event' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { data: existingEvent } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();
    if (!existingEvent || existingEvent.organizer_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: 'Failed to delete event' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body; 
    const { data: rsvp, error } = await supabase
      .from('event_attendees')
      .upsert({
        event_id: id,
        user_id: userId,
        status
      })
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to RSVP to event' });
    }
    if (status === 'attending') {
      await awardPoints(userId, 10, 'rsvp_event', id);
    }
    if (status === 'attending') {
      const { data: eventData } = await supabase
        .from('events')
        .select('end_date')
        .eq('id', id)
        .single();
      if (eventData && new Date(eventData.end_date) < new Date()) {
        await awardPoints(userId, 25, 'attended_event', id);
        await checkAchievements(userId);
      }
    }
    res.json(rsvp);
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        attendees:event_attendees!inner(status)
      `)
      .eq('event_attendees.user_id', userId)
      .order('start_date', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user events' });
    }
    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
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
