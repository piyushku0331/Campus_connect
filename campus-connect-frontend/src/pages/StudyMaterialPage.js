import React from 'react';
import MaterialCard from '../components/materials/MaterialCard';
import '../assets/styles/pages/StudyMaterialPage.css';

const StudyMaterialPage = () => {
  // Mock data - replace with API calls
  const materials = [
    { _id: 1, title: 'Data Structures Notes', subject: 'Computer Science', semester: '4', filePath: '#' },
    { _id: 2, title: 'Calculus Past Papers', subject: 'Mathematics', semester: '2', filePath: '#' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Study Material Hub</h1>
      </div>
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search study materials by subject, topic, or semester..."
          />
          <button className="search-button">
            <span className="search-icon">🔍</span>
            Search
          </button>
        </div>
      </div>
      <div className="materials-grid">
        {materials.map(m => <MaterialCard key={m._id} material={m} />)}
      </div>
    </div>
  );
};

export default StudyMaterialPage;