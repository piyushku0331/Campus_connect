import React from 'react';
import '../../assets/styles/components/events/EventCard.css';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3>{event.title}</h3>
      </div>
      <div className="event-card-body">
        <p><strong>Date:</strong> {eventDate}</p>
        <p><strong>Campus:</strong> {event.campus}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p>{event.description.substring(0, 100)}...</p>
      </div>
      <div className="event-card-footer">
        <button className="btn">View Details</button>
      </div>
    </div>
  );
};

export default EventCard;