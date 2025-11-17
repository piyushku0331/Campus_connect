import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Clock, X, CheckCircle } from 'lucide-react';
import { eventsAPI } from '../services/api';
const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    max_attendees: '',
    campus: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents(1, 50, true);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_attendees: formData.max_attendees || null,
        campus: formData.campus,
        category: formData.category
      };
      await eventsAPI.createEvent(eventData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        max_attendees: '',
        campus: '',
        category: ''
      });
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleRSVP = async (eventId, status) => {
    try {
      await eventsAPI.rsvpEvent(eventId, status);
      setEvents(prev => prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              attendees: status === 'attending'
                ? [...event.attendees, { id: 1, name: "Current User" }] // Mock current user
                : event.attendees.filter(attendee => attendee.id !== 1)
            }
          : event
      ));
      alert(`${status === 'attending' ? 'RSVP confirmed!' : 'RSVP cancelled'}`);
    } catch (error) {
      console.error('Error RSVPing to event:', error);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      <div className="relative z-10">
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
              Campus Events
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
              Discover upcoming events, workshops, and activities happening on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-accent-gradient text-white font-medium px-8 py-3 rounded-full hover:shadow-[0_0_30px_#6B9FFF]/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
              <div className="flex gap-4">
                <div className="glass-card rounded-2xl px-6 py-3">
                  <span className="text-textPrimary font-medium">12</span>
                  <span className="text-textMuted ml-2">Upcoming Events</span>
                </div>
                <div className="glass-card rounded-2xl px-6 py-3">
                  <span className="text-textPrimary font-medium">8</span>
                  <span className="text-textMuted ml-2">This Week</span>
                </div>
              </div>
            </div>
          </motion.div>
          {}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface border border-borderSubtle rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-textPrimary">Create New Event</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-textMuted hover:text-textPrimary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-textPrimary mb-2">Event Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-textPrimary mb-2">Start Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-textPrimary mb-2">End Date & Time</label>
                      <input
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-textPrimary mb-2">Max Attendees (Optional)</label>
                    <input
                      type="number"
                      value={formData.max_attendees}
                      onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-borderSubtle rounded-lg text-textPrimary focus:border-primary focus:outline-none transition-colors"
                      min="1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent-gradient text-white font-medium py-3 px-6 rounded-lg hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Event'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-textMuted mt-4">Loading events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-surface to-[#1A1A2A] border border-borderSubtle rounded-2xl p-6 h-full hover:shadow-glow-primary transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-[#6B9FFF] to-[#7F40FF] shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs bg-white/5 text-textMuted px-3 py-1 rounded-full backdrop-blur-md">
                        {event.tags?.[0] || 'Event'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-3 group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-textMuted text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-textMuted text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(event.start_date)} at {formatTime(event.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-textMuted text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-textMuted text-sm">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees?.length || 0} attending</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRSVP(event.id, 'attending')}
                        className="flex-1 bg-accent-gradient text-white font-medium py-3 px-6 rounded-full hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        RSVP
                      </button>
                      <button
                        onClick={() => handleRSVP(event.id, 'interested')}
                        className="flex-1 bg-surface border border-borderSubtle text-textPrimary font-medium py-3 px-6 rounded-full hover:border-primary hover:scale-105 transition-all duration-300"
                      >
                        Interested
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
};
export default Events;
