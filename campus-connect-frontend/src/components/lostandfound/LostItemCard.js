import React from 'react';
import '../../assets/styles/components/lostandfound/LostItemCard.css';

const LostItemCard = ({ item }) => {
  return (
    <div className={`lost-item-card ${item.status.toLowerCase()}`}>
      <span className="item-status">{item.status}</span>
      <h5>{item.itemName}</h5>
      <p>{item.description}</p>
      {item.location && <p><strong>Location:</strong> {item.location}</p>}
    </div>
  );
};

export default LostItemCard;