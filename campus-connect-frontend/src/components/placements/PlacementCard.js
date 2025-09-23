import React from 'react';
import '../../assets/styles/components/placements/PlacementCard.css';

const PlacementCard = ({ placement }) => {
  return (
    <div className="placement-card">
      <h4>{placement.studentName}</h4>
      <p><strong>Company:</strong> {placement.company}</p>
      <p><strong>Role:</strong> {placement.role}</p>
      <span className="placement-year">{placement.year}</span>
    </div>
  );
};

export default PlacementCard;