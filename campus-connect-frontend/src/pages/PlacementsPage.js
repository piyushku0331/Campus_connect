import React, { useState } from 'react';
import PlacementCard from '../components/placements/PlacementCard';
import '../assets/styles/pages/PlacementsPage.css';

const PlacementsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  
  const placements = [
    { _id: 1, studentName: 'Jane Doe', company: 'TechCorp', role: 'Software Engineer', year: 2025, hasStory: true },
    { _id: 2, studentName: 'John Smith', company: 'Innovate LLC', role: 'Data Analyst', year: 2025, hasStory: true },
    { _id: 4, studentName: 'Alice Brown', company: 'StartupXYZ', role: 'UX Designer', year: 2025, hasStory: true },
    { _id: 5, studentName: 'Bob Wilson', company: 'BigTech Inc', role: 'DevOps Engineer', year: 2025, hasStory: true },
  ];

  const successStories = [
    { _id: 3, studentName: 'Emily White', company: 'Google', role: 'Product Manager', year: 2024, isSuccessStory: true, story: 'A short story about the journey...' },
    { _id: 6, studentName: 'David Chen', company: 'Microsoft', role: 'Senior Developer', year: 2023, isSuccessStory: true, story: 'From campus to leading teams...' },
  ];

  const filteredPlacements = activeFilter === 'All' ? placements : placements.filter(p => p.year.toString() === activeFilter);
  const filteredSuccessStories = activeFilter === 'All' ? successStories : successStories.filter(p => p.year.toString() === activeFilter);

  return (
    <div className="placements-page">
      <div className="page-header">
        <h1>Placements</h1>
      </div>

      <div className="placement-filters">
        <button
          className={activeFilter === 'All' ? 'active' : ''}
          onClick={() => setActiveFilter('All')}
        >
          All Years
        </button>
        <button
          className={activeFilter === '2025' ? 'active' : ''}
          onClick={() => setActiveFilter('2025')}
        >
          2025
        </button>
        <button
          className={activeFilter === '2024' ? 'active' : ''}
          onClick={() => setActiveFilter('2024')}
        >
          2024
        </button>
      </div>

      <section className="placement-section">
        <h2>Recent Placements</h2>
        <p className="section-description">Meet our latest batch of successful placements and their inspiring journeys.</p>
        <div className="placements-grid">
          {filteredPlacements.map(p => <PlacementCard key={p._id} placement={p} />)}
        </div>
      </section>

      <section className="placement-section">
        <h2>Alumni Success Stories</h2>
        <p className="section-description">Inspiring stories from our alumni who have made significant impacts in their careers.</p>
        <div className="placements-grid">
          {filteredSuccessStories.map(p => <PlacementCard key={p._id} placement={p} />)}
        </div>
      </section>
    </div>
  );
};

export default PlacementsPage;