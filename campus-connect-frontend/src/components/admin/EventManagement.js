import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

const EventManagement = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/events/pending`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      if (response.ok) {
        const events = await response.json();
        setPendingEvents(events);
      }
    } catch (err) {
      console.error('Failed to fetch pending events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/events/${eventId}/approve`, {
        method: 'PUT',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      showSuccess('Event approved successfully!');
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
    } catch (err) {
      showError('Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/events/${eventId}/reject`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      showSuccess('Event rejected successfully!');
      setPendingEvents(pendingEvents.filter(event => event._id !== eventId));
    } catch (err) {
      showError('Failed to reject event');
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
                      {event.campus}
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