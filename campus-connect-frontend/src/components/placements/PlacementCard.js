import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/components/placements/PlacementCard.css';

const PlacementCard = ({ placement }) => {
  const cardContent = (
    <div className="placement-card">
      <h4>{placement.studentName}</h4>
      <p><strong>Company:</strong> {placement.company}</p>
      <p><strong>Role:</strong> {placement.role}</p>
      <span className="placement-year">{placement.year}</span>
      {(placement.hasStory || placement.isSuccessStory) && (
        <div className="story-indicator">
          <span>Read Story</span>
        </div>
      )}
    </div>
  );

  if (placement.hasStory || placement.isSuccessStory) {
    return (
      <Link to={`/alumni/${placement._id}`} className="placement-card-link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default PlacementCard;