import React from 'react';
import LostItemCard from '../components/lostandfound/LostItemCard';
import '../assets/styles/pages/LostAndFoundPage.css';

const LostAndFoundPage = () => {
  // Mock data - replace with API calls
  const items = [
    { _id: 1, itemName: 'ID Card', description: 'Student ID card found near library.', status: 'Found', location: 'Library' },
    { _id: 2, itemName: 'Laptop Charger', description: 'Dell laptop charger, black color.', status: 'Lost' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Lost & Found</h1>
        <button className="btn-report">Report an Item</button>
      </div>
      <div className="items-grid">
        {items.map(item => <LostItemCard key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default LostAndFoundPage;