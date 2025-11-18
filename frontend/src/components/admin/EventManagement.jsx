import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { eventsAPI } from '../../services/api';

const EventManagement = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await eventsAPI.getEvents(1, 100, false); // Get all events, filter pending on frontend if needed
      // Assuming backend has pending status, or filter here
      const events = response.data.data || response.data;
      setPendingEvents(events.filter(event => event.status === 'pending' || !event.approved)); // Adjust based on backend
    } catch (err) {
      console.error('Failed to fetch pending events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await eventsAPI.updateEvent(eventId, { approved: true });
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Failed to approve event:', err);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await eventsAPI.deleteEvent(eventId);
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Failed to reject event:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <h2>Manage Events</h2>
        <div className="loading">Loading pending events...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Manage Events</h2>
      <div className="event-management">
        {pendingEvents.length === 0 ? (
          <div className="no-events">
            <p>No pending events to review</p>
          </div>
        ) : (
          <div className="events-list">
            {pendingEvents.map((event) => (
              <div key={event._id} className="event-item card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span className="meta-item">
                      <FaUser className="meta-icon" />
                      {event.organizer?.name || 'Unknown'}
                    </span>
                    <span className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      {event.campus || event.location}
                    </span>
                    <span className="meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="event-content">
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <span className="category">{event.category}</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(event._id)}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(event._id)}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;