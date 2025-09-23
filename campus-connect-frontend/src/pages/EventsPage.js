import React, { useState, useEffect } from 'react';
import EventCard from '../components/events/EventCard';
import { eventsAPI } from '../services/api';
import '../assets/styles/pages/EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsAPI.getEvents();
        setEvents(data || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Upcoming Events & Hackathons</h1>
      </div>
      <div className="filter-controls">
        {/* Add filter inputs here later */}
        <input type="text" placeholder="Filter by campus..." />
        <input type="text" placeholder="Filter by category..." />
        <input type="date" />
      </div>
      <div className="events-grid">
        {events.length > 0 ? (
          events.map(event => <EventCard key={event._id} event={event} />)
        ) : (
          <p>No upcoming events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;