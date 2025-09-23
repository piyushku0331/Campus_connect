import React from 'react';
import PlacementCard from '../components/placements/PlacementCard';
import '../assets/styles/pages/PlacementsPage.css';

const PlacementsPage = () => {
  // Mock data - replace with API calls
  const placements = [
    { _id: 1, studentName: 'Jane Doe', company: 'TechCorp', role: 'Software Engineer', year: 2025 },
    { _id: 2, studentName: 'John Smith', company: 'Innovate LLC', role: 'Data Analyst', year: 2025 },
  ];
  const successStories = [
    { _id: 3, studentName: 'Emily White', company: 'Google', role: 'Product Manager', year: 2024, isSuccessStory: true, story: 'A short story about the journey...' },
  ];

  return (
    <div className="placements-page">
      <div className="page-header">
        <h1>Placements</h1>
      </div>
      
      <section className="placement-section">
        <h2>Recent Placements</h2>
        <div className="placements-grid">
          {placements.map(p => <PlacementCard key={p._id} placement={p} />)}
        </div>
      </section>

      <section className="placement-section">
        <h2>Alumni Success Stories</h2>
        {/* You can create a more detailed card for success stories */}
        {successStories.map(p => <PlacementCard key={p._id} placement={p} />)}
      </section>
    </div>
  );
};

export default PlacementsPage;